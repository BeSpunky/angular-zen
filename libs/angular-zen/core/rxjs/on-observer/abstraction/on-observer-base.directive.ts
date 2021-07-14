import { Observable, Subject, of, timer, forkJoin, combineLatest, queueScheduler } from 'rxjs';
import { delay, first, map, mapTo, materialize, switchMap, takeWhile, tap, mergeMap     } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef              } from '@angular/core';

import { Destroyable                                     } from '../../destroyable/destroyable';
import { ObserverState, DurationAnnotation, DurationUnit } from '../abstraction/types/general';
import { OnObserverContext                               } from './types/on-observer-context';

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
    protected abstract readonly selector : string;
    protected abstract calls             : ObserverState | ObserverState[];
    
    protected showAfter          : DurationAnnotation = 0;
    protected showFor?           : DurationAnnotation;
    protected countdownPrecision?: DurationAnnotation;
    
    protected readonly input: Subject<Observable<T>> = new Subject();
    
    private view     : EmbeddedViewRef<OnObserverContext<T>> | null = null;
    private lastState: ObserverState                                = 'next';
    
    constructor(private readonly template: TemplateRef<OnObserverContext<T>>, private readonly viewContainer: ViewContainerRef)
    {
        super();

        this.subscribe(this.stateFeed());
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

    private stateFeed(): Observable<void>
    {
        return this.input.pipe(
            tap(() => console.log(`new input received`)),
            switchMap(input => this.observeInput(input))
        );
    }

    private observeInput(input: Observable<T>): Observable<void>
    {
        return this.onStateChanged('resolving', undefined as unknown as T).pipe(
            tap(() => console.log(`changed state to resolving. switching to input`)),
            switchMap(() => input.pipe(
                tap(() => console.log(`new value. materializing...`)),
                materialize(),
                map(({ kind, value, error }) => [StateNotificationMap[kind], error || value] as [ObserverState, T]),
                tap(console.log),
            tap(([state]) => console.log(`changing state to '${state}'`)),
            mergeMap(([state, value]) => this.onStateChanged(state, value))
            ))
        );
    }

    private onStateChanged(state: ObserverState, value: T): Observable<void>
    {
        this.lastState = state;
        
        return this.shouldRender(state) ? this.triggerRender(value) : this.destroyView();
    }

    private shouldRender(state: ObserverState): boolean
    {
        const observeOn = Array.isArray(this.calls) ? this.calls : [this.calls];
        
        console.log(`View should render: ${ observeOn.includes(state) }`);
        
        return observeOn.includes(state);
    }

    private triggerRender(value: T): Observable<void>
    {
        const renderDelay = durationToMs(this.showAfter);

        return of(value).pipe(
            // Because by default delay() runs on asyncScheduler, concurrency issues happen between render and destroy
            // causing the view to stay rendered. Executing delay() on queueScheduler causes the timer not to wait
            // for the next event loop, thus keeping synchronous code execution order and logic.
            tap(() => console.log(`delaying render in ${renderDelay}ms`)),
            delay    (renderDelay, queueScheduler),
            tap(() => console.log(`rendering...`)),
            tap      (value => this.renderOrUpdateView(value)),
            tap(() => console.log(`attempting auto destroy...`)),
            switchMap(()    => this.showFor ? this.autoDestroy() : of(void 0))
        );
    }

    private autoDestroy(): Observable<void>
    {
        const showForMs            = durationToMs(this.showFor ?? 0);
        const countdownPrecisionMs = this.defineCountdownPrecisionInterval();

        const destroy = timer(showForMs).pipe(
            first(),
            tap(() => console.log(`destroying...`)),
            switchMap(() => this.destroyView())
        );

        // Enclosing Date.now() in an observable ensures it is called when the observable is
        // actually subscribed to and not during the setup stage inside autoDestroy().
        const startTime = of(0).pipe(
            map(() => Date.now())
        );

        const keepingFor = combineLatest([startTime, timer(0, countdownPrecisionMs)]).pipe(
            map(([startTime]) => Date.now() - startTime),
            map(timePassedMs  => showForMs - timePassedMs),
            map(timeLeftMs    => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap((timeLeftMs) => console.log(`Time left to destroy: ${timeLeftMs}ms. Updating countdown...`)),
            tap(timeLeftMs    => this.updateContextShowFor(timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0)
        );

        return forkJoin([destroy, keepingFor]).pipe(mapTo(void 0));
    }
    
    private renderOrUpdateView(value: T): void
    {
        const context = this.createViewContext(value);

        console.log(`view exists: ${!!this.view}. ${this.view? 'updating context' : 'rendering'}...`);

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

    private destroyView(): Observable<void>
    {
        console.log(`view exists: ${!!this.view}. ${this.view ? 'destroying' : 'skipping destroy'}.`)
        
        if (this.view)
        {
            this.view.destroy();
            this.view = null;
        }

        return of(void 0);
    }

    private createViewContext(value: T): OnObserverContext<T>
    {
        console.log('creating context...');
        return new OnObserverContext(value, this.selector, this.lastState);
    }
}