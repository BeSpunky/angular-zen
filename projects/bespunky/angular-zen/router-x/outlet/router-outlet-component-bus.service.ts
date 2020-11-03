import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
     * You can either subscribe to changes, or get the current value of a component.
     * 
     * The primary unnamed outlet component will be accessible via `undefined`, but it is better to access it via the `primaryComponent` property of the service.
     *
     * @type {{ [outletName: string]: BehaviorSubject<any> }}
     */
    public readonly components: { [outletName: string]: BehaviorSubject<any> } = {};

    /**
     * Gets the subscribable bus for the primary unnamed outlet component.
     *
     * @readonly
     * @type {BehaviorSubject<any>}
     */
    public get primaryComponent(): BehaviorSubject<any>
    {
        return this.components.undefined;
    }

    /**
     * Gets the current instance of the primary unnamed outlet component.
     *
     * @readonly
     * @type {(any | null)}
     */
    public get primaryComponentInstance(): any | null
    {
        return this.instance();
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