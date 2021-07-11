import { Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject, Notification, of, iif, timer, EMPTY } from 'rxjs';
import { delay, delayWhen, first, map, materialize, switchMap, take, tap } from 'rxjs/operators';
import { Destroyable } from '../../destroyable/destroyable';
import { ObserverState, DurationAnnotation, OnObserverContext, DurationUnit } from '../abstraction/types/general';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverState> = {
    N: 'resolving',
    E: 'error',
    C: 'completed'
};

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
            map(({ kind, value }) => [StateNotificationMap[kind], value] as [ObserverState, unknown]),
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

        of(value).pipe(
            delay(renderDelay),
            tap(value => this.renderOrUpdateView(value)),
            switchMap(() => iif(() => !!this.onObserverKeepFor, this.triggerAutoDestroy(), EMPTY))
        ).subscribe();
    }

    private triggerAutoDestroy(): Observable<unknown>
    {
        const destroyDelay = this.durationToMs(this.onObserverKeepFor ?? 0);

        return timer(destroyDelay).pipe(
            first(),
            tap(() => this.destroyView())
        );

    }
    
    private renderOrUpdateView<TValue>(value?: TValue): void
    {
        const context = this.createViewContext(value);

        if (this.view)
            this.view.context = context;
        else
            this.view = this.viewContainer.createEmbeddedView(this.template, context);
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

        const multipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };
        const regex = /(?<value>\d+)(?<units>\w+)/;
        
        const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

        return parseInt(value) * (multipliers[units] || 1);
    }
}