The directives provided by the `ObserveModule` aim to enrich the concept presented by the `async` pipe.

These directives have 3 main goals:
1. Take care of subscribing and unsubscribing from observables automatically.
2. Simplify template mantainability by concentrating subscription in a single place (contrary to multiple `async` pipes in the template).
3. Allow common RxJS combinations from within the template. No imports, no boilerplate.

> Any directive from the module will tracks the assigned observable(s) and updates the template with the emitted value(s) on each emission.

> Any template assigned with the directive will render immediately, and its view context will be updated with the emitted value on
each emission.

## Usage
Either import `ObserveModule` from `@bespunky/angular-zen/core` and use the directives in your templates.
```ts
import { ObserveModule } from '@bespunky/angular-zen/core';
```

> If you have already imported the `CoreModule` from `@bespunky/angular-zen/core` importing the `ObserveModule` is unnecessary, as the `ObserveModule` is exported by the `CoreModule`.

To use the emitted values, you can use either the `as` or the `let` microsyntax.

#### Examples

```html
<!-- Will observe produts$ and update the div's content on every emission -->
<div *observe="products$ as products">
    <h3>{{ products.length }} products</h3>
    <div *ngFor="let product of products">{{ product.name }}</div>
</div>

<!-- Will observe both x$ and y$ using combineLatest(), and update the div's content when either emits a value -->
<div *observeLatest="{ x: x$, y: y$ } as coord">({{ coord.x }}, {{coord.y}})</div>

<!-- Will observe both init$ and progress$ using concat(), and update the div's content first with the messages from init$, then with the values from progress$ -->
<div *observeConcat="[init$, progress$] as statusMessage">{{ statusMessage }}</div>
```

[Live example](https://bs-angular-zen.web.app/Core%20Module/*observe%20directives)

[See the available directives](/docs/zen/modules/ObserveModule.html)

## Other Features

#### Shared observable
The watched observable(s) are combined into a new observable, which is then automatically multicasted so that any child observables created by the template will use the same stream.

The shared observable can be accessed using the `let source = source` microsyntax.

> You can take advantage of the `source` observable and pass it into [`*onObserver` directives](onobservermodule.html).
> ```html
> <div *observeConcat="[init$, progress$] as statusMessage; let source = source">
>     {{ statusMessage }}
>     <h4 *onObserverError="source">❌ Error.</h4>
>     <h4 *onObserverComplete="source">✅ Done.</h4>
> </div>
> ```

#### Observer events
Whenever the observable changes state or emits a value, the corresponding event is emitted:  
`nextCalled` - A value has been emitted. `$event` will be the emitted value.  
`errorCalled` - An error has occured in the pipeline. `$event` will be the error.  
`completeCalled` - The observable has completed. `$event` will be void.

> Because of limitations to Angular's Structural Directives, in order to bind the events the desugared syntax must be used.
This, for example, **will trigger** the event:
> ```html
><ng-template [observe]="x$" let-source="source" (nextCalled)="onNext($event)">
>    ...
></ng-template>
> ```
>
>This **will NOT trigger** the event:
>```html
> <div *observe="x$; let source = source" (nextCalled)="onNext($event)">...</div>
>```
