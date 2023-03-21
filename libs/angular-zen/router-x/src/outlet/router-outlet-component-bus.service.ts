import { BehaviorSubject          } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { PRIMARY_OUTLET           } from '@angular/router';
import { AnyObject } from '@bespunky/typescript-utils';

/**
 * Holds data related with a router outlet event.
 *
 * @export
 * @class RouterOutletEventData
 */
export class RouterOutletEventData
{
    /**
     * Creates an instance of RouterOutletEventData.
     * 
     * @param {string} outletName The name of the outlet which triggered the event. For the primary unnamed outlet, this will be angular's PRIMARY_OUTLET.
     */
    constructor(public readonly outletName: string) { }
    
    /**
     * `true` if the event was triggered by the primary unnamed outlet; otherwise `false`.
     *
     * @readonly
     * @type {boolean}
     */
    public get isPrimaryOutlet(): boolean
    {
        return this.outletName === PRIMARY_OUTLET;
    }
}

/**
 * Holds data related with component publishing triggered by outlet activation.
 *
 * @export
 * @class ComponentPublishEventData
 * @extends {RouterOutletEventData}
 */
export class ComponentPublishEventData extends RouterOutletEventData
{
    /**
     * Creates an instance of ComponentPublishEventData.
     * 
     * @param {BehaviorSubject<AnyObject | null>} changes The observable used to track changes to the activated component of the triggering outlet.
     * @param {string} outletName The name of the outlet which triggered the event. For the primary unnamed outlet, this will be angular's PRIMARY_OUTLET.
     */
    constructor(public readonly changes: BehaviorSubject<AnyObject | null>, outletName: string)
    {
        super(outletName);
    }

    /**
     * The instance of the last component activated by the outlet which triggered the event.
     * This will be null if the outlet has deactivated the component.
     * 
     * @readonly
     * @type {(AnyObject | null)}
     */
    public get componentInstance(): AnyObject | null
    {
        return this.changes.value;
    }
}

/**
 * Provides a publish bus for the currently rendered component.
 * 
 * **Why?**  
 * Angular's router only provides the type of component being rendered for a specific route, but not the instance it has created for it.
 * This service is a bridge which allows other services to get a hold of the instance of a currently rendered component.
 * 
 * **How to use:**  
 * Use the [`publishComponent`](/directives/PublishComponentDirective.html) directive on your `<router-outlet>` element. This will hook into the outlet's `activate` event and pass
 * the activated component to the bus service:

 * @example
 * <!-- Component template -->
 * <router-outlet publishComponent name="header"></router-outlet>
 * <router-outlet publishComponent              ></router-outlet>
 * <router-outlet publishComponent name="footer"></router-outlet>
 *  
 * @export
 * @class RouterOutletComponentBus
 */
@Injectable({ providedIn: 'root' })
export class RouterOutletComponentBus
{
    private _outletsState = new Map<string, AnyObject | null>();

    /**
     * Gets a shallow clone of the current state outlet state.
     *
     * @readonly
     * @type {(Map<string, AnyObject | null>)}
     */
    public get outletsState(): Map<string, AnyObject | null>
    {
        return new Map(this._outletsState);
    }

    /**
     * A map of the currently instantiated components by outlet name.
     * Users can either subscribe to changes, or get the current value of a component.
     * 
     * The primary unnamed outlet component will be accessible via PRIMARY_OUTLET, but for scalability it is better to access it via the `instance()` method.
     *
     * @private
     */
    private readonly components = new Map<string, BehaviorSubject<AnyObject | null>>();

    /**
     * Emits whenever a router outlet marked with the `publishComponent` directive activates a component.
     * When an outlet deactivates a component, the published component instance will be `null`.
     * 
     * @type {EventEmitter<ComponentPublishEventData>}
     */
    public readonly componentPublished  : EventEmitter<ComponentPublishEventData> = new EventEmitter();
    /**
     * Emits whenever a router outlet marked with the `publishComponent` directive is removed from the DOM.
     *
     * @type {EventEmitter<ComponentPublishEventData>}
     */
    public readonly componentUnpublished: EventEmitter<RouterOutletEventData>     = new EventEmitter();

    /**
     * Publishes the instance of a currently activated or deactivated component by the specified outlet.
     * When an outlet first publishes, this will create an observable for tracking the outlet's changes.
     * The observable can be fetched using the `changes()` method.
     * Following calls to publish a component by the same outlet will subscribers.
     * 
     * The last published component of an outlet can be fetched using the `instance()` method.
     * 
     * @param {AnyObject | null} instance The instance of the activated component. For publishing deactivation of a component pass `null`.
     * @param {string} [outletName=PRIMARY_OUTLET] (Optional) The name of the outlet which activated or deactivated the component. The primary unnamed outlet will be used when not specified.
     */
    public publishComponent(instance: AnyObject | null, outletName: string = PRIMARY_OUTLET): void
    {
        const components = this.components;

        let componentChanges = components.get(outletName);

        if (!componentChanges)
        {
            componentChanges = new BehaviorSubject(instance);
            components.set(outletName, componentChanges);
        }
        
        this._outletsState.set(outletName, instance);
        componentChanges.next(instance);

        this.componentPublished.emit(new ComponentPublishEventData(componentChanges, outletName));
    }

    /**
     * Notifies any subscribers to the outlet's changes observable that the outlet is being removed by completing
     * the observable and removes the observable from the service.
     *
     * @param {string} [outletName=PRIMARY_OUTLET] (Optional) The name of the outlet to unpublish. The primary unnamed outlet will be used when not specified.
     */
    public unpublishComponent(outletName: string = PRIMARY_OUTLET): void
    {
        const components = this.components;

        if (components.has(outletName))
        {
            // Notify any subscribers that the outlet will stop emitting
            components.get(outletName)?.complete();
            // Make sure the outlet is no longer present on the bus
            components.delete(outletName);
            this._outletsState.delete(outletName);

            this.componentUnpublished.emit(new RouterOutletEventData(outletName));
        }
    }

    /**
     * Checks whether the outlet by the given name is present in the DOM and has already activated at least one component.
     * This will be `true` even if the outlet currently has no active component (component is `null`).
     * 
     * A `false` value can either mean the outlet hasn't been marked with `publishComponent`, or that the outlet is not currently rendered (not present in the DOM).
     * 
     * When `true`, the user can subscribe to changes of that outlet through the `changes()` method.
     * 
     * @param {string} [outletName=PRIMARY_OUTLET] (Optional) The name of the outlet to check. The primary unnamed outlet will be checked if no name is provided.
     * @returns {boolean} `true` if the outlet has published a component at least once; otherwise `false`.
     */
    public isComponentPublished(outletName: string = PRIMARY_OUTLET): boolean
    {
        return this.components.has(outletName);
    }

    /**
     * Gets an observable which can be used to track changes to the activated component of the specified outlet.
     * If the outlet is not rendered (present in the DOM), or hasn't been marked with `publishComponent`, this will be `null`.
     *
     * @param {string} [outletName=PRIMARY_OUTLET] (Optional) The name of the outlet to track changes for. The primary unnamed outlet will be used when not specified.
     * @returns {(BehaviorSubject<AnyObject | null> | null)} An observable to use for tracking changes to the activated component for the specified outlet, or `null` if no such outlet exists.
     */
    public changes(outletName: string = PRIMARY_OUTLET): BehaviorSubject<AnyObject | null> | null
    {
        return this.components.get(outletName) ?? null;
    }
    
    /**
     * Gets the current instance of the component created by the specified outlet.
     *
     * @param {string} [outletName=PRIMARY_OUTLET] (Optional) The name of the outlet to fetch the component instance for. If not provided, the primary unnamed outlet's component will be fetched.
     * @returns {(AnyObject | null)} The instance of the component created by the specified outlet. If the outlet doesn't exist, or there is no component instance for the requested outlet, returns `null`.
     */
    public instance(outletName: string = PRIMARY_OUTLET): AnyObject | null
    {
        return this.components.get(outletName)?.value ?? null;
    }
}