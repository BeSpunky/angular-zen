import { Observable, Subject, of, timer, EMPTY, forkJoin, combineLatest           } from 'rxjs';
import { delay, first, map, materialize, switchMap, takeWhile, tap                } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Destroyable                                                          } from '../../destroyable/destroyable';
import { ObserverHandler, DurationAnnotation, OnObserverContext, DurationUnit } from '../abstraction/types/general';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverHandler> = {
    N: 'next',
    E: 'error',
    C: 'complete'
};

const DurationMultipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };

const DefaultDurationIntervalDivisor = 30;

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserver]'
})
export class OnObserverDirective<T> extends Destroyable implements OnInit
{
    @Input() public set onObserver(value: Observable<T>) { this.input.next(value); }

    @Input() public onObserverCalls              : ObserverHandler | ObserverHandler[] = 'next';
    @Input() public onObserverShowAfter          : DurationAnnotation = 0;
    @Input() public onObserverShowFor?           : DurationAnnotation;
    @Input() public onObserverCountdownPrecision?: DurationAnnotation;
    
    private view    : EmbeddedViewRef<OnObserverContext<unknown>> | null = null;
    private lastCall: ObserverHandler                                      = 'next';
    
    private readonly input: Subject<Observable<T>> = new Subject();
    
    constructor(private readonly template: TemplateRef<OnObserverContext<unknown>>, private readonly viewContainer: ViewContainerRef)
    {
        super();
    }

    ngOnInit()
    {
        this.onHandlerCalled('next');

        this.subscribe(this.sourceFeed());
    }

    private defineCountdownPrecisionInterval(): number
    {
        // If the view should persist, or it should auto-destroy but percision has been manually specified, do nothing
        if (!this.onObserverShowFor) throw new Error(`
            Auto-destroy countdown seems to have been initiated when 'showFor' hasn't been set. This shouldn't have happend.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);
        
        if (this.onObserverCountdownPrecision) return this.durationToMs(this.onObserverCountdownPrecision);

        const showForMs = this.durationToMs(this.onObserverShowFor);

        return showForMs / DefaultDurationIntervalDivisor;
    }

    private sourceFeed(): Observable<unknown>
    {
        return this.input.pipe(
            switchMap(input => this.observeInput(input))
        );
    }

    private observeInput(input: Observable<T>): Observable<unknown>
    {
        return input.pipe(
            materialize(),
            map(({ kind, value, error }) => [StateNotificationMap[kind], error || value] as [ObserverHandler, unknown]),
            tap(([handler]        ) => this.lastCall = handler),
            tap(([handler, value] ) => this.onHandlerCalled(handler, value))
        )
    }

    private onHandlerCalled<TValue>(handler: ObserverHandler, value?: TValue): void
    {
        this.shouldRender(handler) ? this.triggerRender(value) : this.destroyView();
    }

    private shouldRender(handler: ObserverHandler): boolean
    {
        const observeOn = Array.isArray(this.onObserverCalls) ? this.onObserverCalls : [this.onObserverCalls];

        return observeOn.includes(handler);
    }

    private triggerRender<TValue>(value: TValue): void
    {
        const renderDelay = this.durationToMs(this.onObserverShowAfter);

        const render = of(value).pipe(
            delay    (renderDelay),
            tap      (value => this.renderOrUpdateView(value)),
            switchMap(()    => this.onObserverShowFor ? this.autoDestroy() : EMPTY)
        );

        this.subscribe(render);
    }

    private autoDestroy(): Observable<unknown>
    {
        const showForMs            = this.durationToMs(this.onObserverShowFor ?? 0);
        const countdownPrecisionMs = this.defineCountdownPrecisionInterval();

        const destroy = timer(showForMs).pipe(
            first(),
            tap(() => this.destroyView())
        );

        // Enclosing Date.now() in an observable to make sure it is called when the observable is
        // actually subscribed to and not during the setup stage inside autoDestroy().
        const startTime = of(0).pipe(
            map(() => Date.now())
        );

        const keepingFor = combineLatest([startTime, timer(0, countdownPrecisionMs)]).pipe(
            map(([startTime]) => Date.now() - startTime),
            map(timePassedMs  => showForMs - timePassedMs),
            map(timeLeftMs    => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap(timeLeftMs    => this.updateContextShowFor(timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0)
        );

        return forkJoin([destroy, keepingFor]);
    }
    
    private renderOrUpdateView<TValue>(value?: TValue): void
    {
        const context = this.createViewContext(value);

        if (this.view)
            this.view.context = context;
        else
            this.view = this.viewContainer.createEmbeddedView(this.template, context);
    }

    private updateContextShowFor(showingForMs: number): void
    {
        if (!this.view) return;
        
        const dummyDate = new Date(showingForMs);

        this.view.context.showingFor = {
            m : dummyDate.getMinutes(),
            s : dummyDate.getSeconds(),
            ms: dummyDate.getMilliseconds()
        };
    }

    private destroyView(): void
    {
        if (this.view)
        {
            this.view.destroy();
            this.view = null;
        }
    }

    private createViewContext<TValue>(value: TValue): OnObserverContext<TValue>
    {
        return { $implicit: value, onObserver: value, lastCall: this.lastCall };
    }

    private durationToMs(duration: DurationAnnotation): number
    {
        if (typeof duration === 'number') return duration;

        const regex = /(?<value>\d+)(?<units>\w+)/;
        
        const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

        return parseInt(value) * (DurationMultipliers[units] || 1);
    }
}