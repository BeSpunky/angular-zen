import { Directive, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet                  } from '@angular/router';

import { Destroyable              } from '@bespunky/angular-zen/core';
import { RouterOutletComponentBus } from './router-outlet-component-bus.service';

/**
 * Hooks into a router outlet's events and publishes the current component to the `RouterOutletComponentBus` to create a mapping
 * of component instances by outlet name.
 * 
 * How to use:
 * Use the `publishComponent` directive on your `<router-outlet>` element.
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
 * @See `RouterOutletComponentBus` for more details.
 * 
 * @export
 * @class PublishComponentDirective
 * @extends {Destroyable}
 * @implements {OnInit}
 */
@Directive({
    selector: 'router-outlet[publishComponent]'
})
export class PublishComponentDirective extends Destroyable implements OnInit
{
    private outletName: string;

    constructor(private outlet: RouterOutlet, private element: ElementRef, private componentBus: RouterOutletComponentBus) { super(); }

    ngOnInit()
    {
        this.outletName = this.element.nativeElement.attributes.name?.value;

        // When the outlet activates a new instance, update the component on the bus
        this.subscribe(this.outlet.activateEvents, this.updateComponentOnBus.bind(this));
        // When the outlet deactivates an instance, set the component to null on the bus.
        this.subscribe(this.outlet.deactivateEvents, () => this.updateComponentOnBus(null));
    }

    ngOnDestroy()
    {
        // An outlet might be kept alive while its component is switched. So when the outlet is completely destroyed,
        // it will be completely removed from the bus, even though its value on the bus is null.

        this.componentBus.unpublishComponent(this.outletName);

        super.ngOnDestroy();
    }

    private updateComponentOnBus(instance: any): void
    {
        this.componentBus.publishComponent(instance, this.outletName);        
    }
}