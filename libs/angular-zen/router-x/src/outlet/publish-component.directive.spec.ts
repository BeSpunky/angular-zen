import { BehaviorSubject           } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule       } from '@angular/router/testing';
import { Component                 } from '@angular/core';
import { Router, Routes            } from '@angular/router';

import { forceRoutingInsideAngularZone } from '@bespunky/angular-zen/core/testing';
import { RouterXModule                 } from '../router-x.module';
import { RouterOutletComponentBus      } from './router-outlet-component-bus.service';

@Component({ selector: 'bs-zen-router-x-main'  , template: '<div>main</div>'   }) class MainComponent   { }
@Component({ selector: 'bs-zen-router-x-header', template: '<div>header</div>' }) class HeaderComponent { }
@Component({ selector: 'bs-zen-router-x-footer', template: '<div>footer</div>' }) class FooterComponent { }

type OutletTestPath = 'outletInit' | 'outletUpdate' | 'outletRemoval';

const outletMap: Record<OutletTestPath, { header: string[] | null, footer: string[] | null }> = {
    outletInit   : { header: ['outletInit']  , footer: ['outletInit']   },
    outletUpdate : { header: ['outletUpdate'], footer: ['outletUpdate'] },
    outletRemoval: { header: null, footer: null },
};

describe('PublishComponentDirective', () =>
{
    let fixture     : ComponentFixture<OutletContainerComponent>;
    let container   : OutletContainerComponent;
    let componentBus: RouterOutletComponentBus;
    let router      : Router;

    async function navigate(route: OutletTestPath)
    {
        // For some reason the router doesn't recognize the route if outlets are specified on the same navigation call
        await router.navigate([route]);
        // When navigation is done, add outlets
        return router.navigate([{ outlets: outletMap[route] }]);
    }

    async function setup(route: OutletTestPath)
    {
        const routes: Routes = [
            // For outlet init testing: Route should create three outlets
            { path: 'outletInit', component: MainComponent },
            { path: 'outletInit', component: HeaderComponent, outlet: 'header' },
            { path: 'outletInit', component: FooterComponent, outlet: 'footer' },
            // For outlet update testing: Route should create three outlets and switch between header and footer.
            { path: 'outletUpdate', component: MainComponent, outlet: undefined },
            { path: 'outletUpdate', component: FooterComponent, outlet: 'header' },
            { path: 'outletUpdate', component: HeaderComponent, outlet: 'footer' },
            // For outlet removal testing: Route should remove the named outlets
            { path: 'outletRemoval', component: MainComponent, outlet: undefined },
            { path: 'outletRemoval', component: HeaderComponent, outlet: 'header' },
            { path: 'outletRemoval', component: FooterComponent, outlet: 'footer' },
        ];

        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
                RouterXModule.forRoot()
            ],
            declarations: [OutletContainerComponent]
        }).compileComponents();

        componentBus = TestBed.inject(RouterOutletComponentBus);
        router       = TestBed.inject(Router);
        fixture      = TestBed.createComponent(OutletContainerComponent);
        container    = fixture.debugElement.componentInstance;

        forceRoutingInsideAngularZone(router);

        router.initialNavigation();
        
        fixture.autoDetectChanges(true);

        return navigate(route);
    }

    it('should create an observable for each marked outlet accessible by name', async () =>
    {
        await setup('outletInit');
        
        expect(componentBus.changes()).toBeInstanceOf(BehaviorSubject);
        expect(componentBus.changes('header'   )).toBeInstanceOf(BehaviorSubject);
        expect(componentBus.changes('footer'   )).toBeInstanceOf(BehaviorSubject);
    });

    it('should publish the activated component to the bus', async () =>
    {
        await setup('outletInit');

        expect(componentBus.instance()).toBeInstanceOf(MainComponent);
        expect(componentBus.instance('header')).toBeInstanceOf(HeaderComponent);
        expect(componentBus.instance('footer')).toBeInstanceOf(FooterComponent);
    });

    it('should update the instance of a component on the bus when replaced by router', async () =>
    {
        await setup('outletUpdate');

        expect(componentBus.instance()).toBeInstanceOf(MainComponent);
        expect(componentBus.instance('header')).toBeInstanceOf(FooterComponent); // Header has footer
        expect(componentBus.instance('footer')).toBeInstanceOf(HeaderComponent); // Footer has header
    });
    
    it('should set the component instance to null on the bus when removed by router', async () =>
    {
        await setup('outletRemoval');
        
        expect(componentBus.instance()).toBeInstanceOf(MainComponent);
        expect(componentBus.instance('header')).toBeNull();
        expect(componentBus.instance('footer')).toBeNull();
    });

    it('should remove the named outlets from the bus when outlet is destroyed', async () =>
    {
        await setup('outletInit');

        // Setting false will trigger the removal of the last router outlet from the DOM, which in turn should trigger
        // the destruction of the directive.
        container.showFooter = false;

        fixture.detectChanges();

        expect(componentBus.instance()).toBeInstanceOf(MainComponent);
        expect(componentBus.instance('header')).toBeInstanceOf(HeaderComponent);
        expect(componentBus.instance('footer')).toBeNull();
        expect(componentBus.changes ('footer')).toBeNull();
    });
});

@Component({
    selector: 'bs-zen-router-x-test',
    template: `
        <router-outlet publishComponent name="header"                   ></router-outlet>
        <router-outlet publishComponent                                 ></router-outlet>
        <router-outlet publishComponent name="footer" *ngIf="showFooter"></router-outlet>
    `
})
export class OutletContainerComponent
{
    public showFooter = true;
}
