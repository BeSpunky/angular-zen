import { Observable, Subject, of, timer, EMPTY, forkJoin, combineLatest           } from 'rxjs';
import { delay, first, map, materialize, switchMap, takeWhile, tap                } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Destroyable                                                         } from '../../destroyable/destroyable';
import { ObserverState, DurationAnnotation, DurationUnit } from '../abstraction/types/general';
import { OnObserverContext } from './types/on-observer-context';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverState> = {
    N: 'next',
    E: 'error',
    C: 'complete'
};

const DurationMultipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };

const DefaultDurationIntervalDivisor = 30;

function durationToMs(duration: DurationAnnotation): number
{
    if (typeof duration === 'number') return duration;

    const regex = /(?<value>\d+)(?<units>\w+)/;
    
    const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

    return parseInt(value) * (DurationMultipliers[units] || 1);
}

@Directive()
export abstract class OnObserverBaseDirective<T> extends Destroyable
{
    // @Input() public set onObserver(value: Observable<T>) { this.input.next(value); }

    // @Input() public onObserverCalls              : ObserverHandler | ObserverHandler[] = 'next';
    // @Input() public onObserverShowAfter          : DurationAnnotation = 0;
    // @Input() public onObserverShowFor?           : DurationAnnotation;
    // @Input() public onObserverCountdownPrecision: DurationAnnotation;
    
    private view     : EmbeddedViewRef<OnObserverContext<T>> | null = null;
    private lastState: ObserverState                                = 'next';
    
    protected abstract readonly selector : string;
    protected abstract calls             : ObserverState;
    protected abstract showAfter         : DurationAnnotation;
    protected abstract showFor?          : DurationAnnotation;
    protected abstract countdownPrecision: DurationAnnotation;
    
    private readonly input: Subject<Observable<T>> = new Subject();
    
    constructor(private readonly template: TemplateRef<OnObserverContext<T>>, private readonly viewContainer: ViewContainerRef)
    {
        super();

        this.subscribe(this.sourceFeed());
        
        this.onStateChanged('resolving', undefined as unknown as T);
    }

    private defineCountdownPrecisionInterval(): number
    {
        // If the view should persist, or it should auto-destroy but percision has been manually specified, do nothing
        if (!this.showFor) throw new Error(`
            Auto-destroy countdown seems to have been initiated when 'showFor' hasn't been set. This shouldn't have happend.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);
        
        if (this.countdownPrecision) return durationToMs(this.countdownPrecision);

        const showForMs = durationToMs(this.showFor);

        return showForMs / DefaultDurationIntervalDivisor;
    }

    private sourceFeed(): Observable<[handler: ObserverState, value: T]>
    {
        return this.input.pipe(
            switchMap(input => this.observeInput(input))
        );
    }

    private observeInput(input: Observable<T>): Observable<[handler: ObserverState, value: T]>
    {
        return input.pipe(
            materialize(),
            map(({ kind, value, error }) => [StateNotificationMap[kind], error || value] as [ObserverState, T]),
            tap(([state]        ) => this.lastState = state),
            tap(([state, value] ) => this.onStateChanged(state, value))
        )
    }

    private onStateChanged(state: ObserverState, value: T): void
    {
        this.shouldRender(state) ? this.triggerRender(value) : this.destroyView();
    }

    private shouldRender(handler: ObserverState): boolean
    {
        const observeOn = Array.isArray(this.calls) ? this.calls : [this.calls];

        return observeOn.includes(handler);
    }

    private triggerRender(value: T): void
    {
        const renderDelay = durationToMs(this.showAfter);

        const render = of(value).pipe(
            delay    (renderDelay),
            tap      (value => this.renderOrUpdateView(value)),
            switchMap(()    => this.showFor ? this.autoDestroy() : EMPTY)
        );

        this.subscribe(render);
    }

    private autoDestroy(): Observable<unknown>
    {
        const showForMs            = durationToMs(this.showFor ?? 0);
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
    
    private renderOrUpdateView(value: T): void
    {
        const context = this.createViewContext(value);

        this.view 
            ? this.view.context = context
            : this.view         = this.viewContainer.createEmbeddedView(this.template, context);
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

    private createViewContext(value: T): OnObserverContext<T>
    {
        return new OnObserverContext(value, this.selector, this.lastState);
    }
}