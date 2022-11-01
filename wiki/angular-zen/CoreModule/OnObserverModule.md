The directives provided by the `OnObserverModule` aim facilitate and enrich the common practice of conditionally rendering template elements according to observable states (i.e. resolving, next, error, complete).

In other words, they allow you to:
1. Delay rendering of an element until an observable has a specific state(s).
2. Automatically unrender the element after an amount of time.
3. Duplicate the element for each emission, facilitating snack-bar-stacking-like behavior.

## Usage
Either import `OnObserverModule` directly or the `CoreModule` and use the directives.

To use the emitted values, you can use either the `as` or the `let` microsyntax.

#### Examples

```html
<!-- Will render a new div for each emission, passing it the received notification and destroying it after 5 seconds.
If a new notification is received before the previous one is destroyed, the div will not be replaced. A new one will 
be created and appended to the DOM after it. -->
<div *onObserverNext="notifications$ as notification; viewMode 'multiple'; showFor '5s'; let remaining = remaining">
    <h3>{{ notification }}</h3>
    <h6>Closing in {{ remaining.s }} seconds...</h6>
</div>
```

[Live example](https://bs-angular-zen.web.app/Core%20Module/*onObserver%20directives)

[See all available directives](/docs/zen/modules/OnObserverModule.html)

[See using inside `*observe` directives](observemodule.html#shared-observable)

## Features

#### View Context
Use the microsyntax `as` keyword to assign resolved values to a variable.
Use the microsyntax `let` keyword to assign the  full context object to a variable (e.g. `let context`).
 
#### Delayed rendering
Specify a value for showAfter `showAfter` to delay rendering.

#### Auto destroy
Specify `showFor` to automatically destroy the view after a certain duration.

#### Countdown updates
When {@link OnObserverBaseDirective.showFor `showFor`} is specified, the view context will be updated with the time remaining until the view is destroyed and the time elapsed since it was rendered. This allows giving the user feedback in a progress bar, a spinner, a textual timer or any other UI component. 

Remaining is provided by the {@link OnObserverContext.remaining `remaining`} property. Elapsed time is provided by the {@link OnObserverContext.elapsed `elapsed`} property. Access it by assigning a variable using `let`, like so:  
`let remaining = remaining`

#### Multi view mode
Specify `viewMode = 'multiple'` to enable rendering a new view for each intercepted call
instead of updating a single rendered view. This allows stacking logs, notification snackbars, or any other aggregation functionality.
Combined with `showFor`, this is great for disappearing messages/notifications.

#### View index
In multi-view mode, the context will contain the index of the view, which can be used for calculations and styling.
