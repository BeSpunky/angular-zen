import { BehaviorSubject          } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';

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
     * @param {string} outletName The name of the outlet which triggered the event. For the primary unnamed outlet, this will be `undefined`.
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
        return this.outletName === 'undefined';
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
     * @param {BehaviorSubject<any>} changes The observable used to track changes to the activated component of the triggering outlet.
     * @param {string} outletName The name of the outlet which triggered the event. For the primary unnamed outlet, this will be `undefined`.
     */
    constructor(public readonly changes: BehaviorSubject<any>, outletName: string)
    {
        super(outletName);
    }

    /**
     * The instance of the last component activated by the outlet which triggered the event.
     * This will be null if the outlet has deactivated the component.
     * 
     * @readonly
     * @type {(any | null)}
     */
    public get componentInstance(): any | null
    {
        return this.changes.value;
    }
}

/**
 * What this service does:
 * Provides a publish bus for the currently rendered component.
 * 
 * Why?
 * Angular's router only provides the type of component being rendered for a specific route, but not the instance it has created for it.
 * This service is a bridge allows other services to get a hold of the instance of a currently rendered component.
 * 
 * How to use:
 * Use the `publishComponent` directive on your `<router-outlet>` element. This will hook into the outlet's `activate` event and pass
 * the activated component to the bus service:
 * 
 * ```html
 * <!-- Component template -->
 * <router-outlet publishComponent name="header"></router-outlet>
 * <router-outlet publishComponent              ></router-outlet>
 * <router-outlet publishComponent name="footer"></router-outlet>
 * ```
 * 
 * The components instantiated by outlets marked with `publishComponent` will be accessible by outlet name in the bus service.
 * 
 * @export
 * @class RouterOutletComponentBus
 */
@Injectable({ providedIn: 'root' })
export class RouterOutletComponentBus
{
    /**
     * A map of the currently instantiated components by outlet name.
     * Users can either subscribe to changes, or get the current value of a component.
     * 
     * The primary unnamed outlet component will be accessible via `undefined`, but for scalability it is better to access it via the `instance()` method.
     *
     * @type {{ [outletName: string]: BehaviorSubject<any> }}
     */
    private readonly components: { [outletName: string]: BehaviorSubject<any> } = {};

    /**
     * Emits whenever a router outlet marked with the `publishComponent` directive activates a component.
     * When an outlet deactivates a component, the published component instance will be `null`.
     * 
     * @type {EventEmitter<ComponentPublishEventData>}
     */
    public componentPublished  : EventEmitter<ComponentPublishEventData> = new EventEmitter();
    /**
     * Emits whenever a router outlet marked with the `publishComponent` directive is removed from the DOM.
     *
     * @type {EventEmitter<ComponentPublishEventData>}
     */
    public componentUnpublished: EventEmitter<RouterOutletEventData>     = new EventEmitter();

    /**
     * Publishes the instance of a currently activated or deactivated component by the specified outlet.
     * When an outlet first publishes, this will create an observable for tracking the outlet's changes.
     * The observable can be fetched using the `changes()` method.
     * Following calls to publish a component by the same outlet will subscribers.
     * 
     * The last published component of an outlet can be fetched using the `instance()` method.
     * 
     * @param {*} instance The instance of the activated component. For publishing deactivation of a component pass `null`.
     * @param {string} [outletName] (Optional) The name of the outlet which activated or deactivated the component. The primary unnamed outlet will be used when not specified.
     */
    public publishComponent(instance: any, outletName?: string): void
    {
        const components       = this.components;
        const componentChanged = components[outletName] || new BehaviorSubject(instance);

        if (!components[outletName]) components[outletName] = componentChanged;
            
        componentChanged.next(instance);

        this.componentPublished.emit(new ComponentPublishEventData(componentChanged, outletName));
    }

    /**
     * Notifies any subscribers to the outlet's changes observable that the outlet is being removed by completing
     * the observable and removes the observable from the service.
     *
     * @param {string} outletName (Optional) The name of the outlet to unpublish. The primary unnamed outlet will be used when not specified.
     */
    public unpublishComponent(outletName?: string): void
    {
        const components = this.components;

        if (components[outletName])
        {
            // Notify any subscribers that the outlet will stop emitting
            components[outletName].complete();
            // Make sure the outlet is no longer present on the bus
            delete components[outletName];

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
     * @param {string} [outletName] (Optional) The name of the outlet to check. The primary unnamed outlet will be checked if no name is provided.
     * @returns {boolean} `true` if the outlet has published a component at least once; otherwise `false`.
     */
    public isComponentPublished(outletName?: string): boolean
    {
        return !!this.components[outletName];
    }

    /**
     * Gets an observable which can be used to track changes to the activated component of the specified outlet.
     * If the outlet is not rendered (present in the DOM), or hasn't been marked with `publishComponent`, this will be `null`.
     *
     * @param {string} [outletName] (Optional) The name of the outlet to track changes for. The primary unnamed outlet will be used when not specified.
     * @returns {(BehaviorSubject<any> | null)} An observable to use for tracking changes to the activated component for the specified outlet, or `null` if no such outlet exists.
     */
    public changes(outletName?: string): BehaviorSubject<any> | null
    {
        return this.components[outletName] || null;
    }
    
    /**
     * Gets the current instance of the component created by the specified outlet.
     *
     * @param {string} [outletName] (Optional) The name of the outlet to fetch the component instance for. If not provided, the primary unnamed outlet's component will be fetched.
     * @returns {(any | null)} The instance of the component created by the specified outlet. If the outlet doesn't exist, or there is no component instance for the requested outlet, returns `null`.
     */
    public instance(outletName?: string): any | null
    {
        return this.components[outletName]?.value || null;
    }
}