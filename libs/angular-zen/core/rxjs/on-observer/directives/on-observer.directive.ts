import { Observable, Subject, of, iif, timer, EMPTY, interval, forkJoin           } from 'rxjs';
import { delay, first, map, materialize, switchMap, takeWhile, tap                } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Destroyable                                                        } from '../../destroyable/destroyable';
import { ObserverState, DurationAnnotation, OnObserverContext, DurationUnit } from '../abstraction/types/general';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverState> = {
    N: 'resolving',
    E: 'error',
    C: 'completed'
};

const DurationMultipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };

@Directive({
    selector: '[onObserver]'
})
export class OnObserverDirective<T> extends Destroyable implements OnInit
{
    @Input() public set onObserver(value: Observable<T>) { this.input.next(value); }

    @Input() public onObserverHasState: ObserverState | ObserverState[] = 'resolving';
    @Input() public onObserverDelayFor: DurationAnnotation = 0;
    @Input() public onObserverKeepFor?: DurationAnnotation;
    
    private view : EmbeddedViewRef<OnObserverContext<unknown>> | null = null;
    private state: ObserverState                                      = 'resolving';
    
    private readonly input: Subject<Observable<T>> = new Subject();
    
    constructor(private readonly template: TemplateRef<OnObserverContext<unknown>>, private readonly viewContainer: ViewContainerRef)
    {
        super();
    }

    ngOnInit()
    {
        this.onStateChange('resolving');

        this.subscribe(this.sourceFeed());
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
            map(({ kind, value, error }) => [StateNotificationMap[kind], error || value] as [ObserverState, unknown]),
            tap(([state]        ) => this.state = state),
            tap(([state, value] ) => this.onStateChange(state, value))
        )
    }

    private onStateChange<TValue>(state: ObserverState, value?: TValue): void
    {
        if (this.shouldRender(state))
            this.triggerRender(value);
        else
            this.destroyView();
    }

    private shouldRender(state: ObserverState): boolean
    {
        const observeOn = Array.isArray(this.onObserverHasState) ? this.onObserverHasState : [this.onObserverHasState];

        return observeOn.includes(state);
    }

    private triggerRender<TValue>(value: TValue): void
    {
        const renderDelay = this.durationToMs(this.onObserverDelayFor);

        const render = of(value).pipe(
            delay(renderDelay),
            tap(value => this.renderOrUpdateView(value)),
            switchMap(() => iif(() => !!this.onObserverKeepFor, this.autoDestroy(), EMPTY))
        );

        this.subscribe(render);
    }

    private autoDestroy(): Observable<unknown>
    {
        const destroyDelayMs = this.durationToMs(this.onObserverKeepFor ?? 0);

        const destroy = timer(destroyDelayMs).pipe(
            first(),
            tap(() => this.destroyView())
        );

        const startTime = Date.now();

        const keepingFor = interval(200).pipe(
            map(() => Date.now() - startTime),
            map(timePassedMs => destroyDelayMs - timePassedMs),
            map(timeLeftMs => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap(timeLeftMs => this.updateContextKeepingFor(timeLeftMs)),
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

    private updateContextKeepingFor(keepingForMs: number): void
    {
        if (this.view)
            this.view.context.keepingForMs = keepingForMs;
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
        return { $implicit: value, state: this.state };
    }

    private durationToMs(duration: DurationAnnotation): number
    {
        if (typeof duration === 'number') return duration;

        const regex = /(?<value>\d+)(?<units>\w+)/;
        
        const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

        return parseInt(value) * (DurationMultipliers[units] || 1);
    }
}