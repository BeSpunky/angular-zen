Angular's `ActivatedRoute` service only exposes the *type* of component and the name of the outlet it relates to. However, in some cases it is necessary to get a hold of the actual *instance* of the component activated for a certain route.

This service lets you:
1. Gain access to the instances of router activated components from anywhere in your app.
2. Grab outlet-specific observables and listen for changes to the active component in an outlet.

# How to use
1. Import `RouterXModule` in your app to enable the use of the [`PublishComponentDirective`](LINK).

2. Mark your outlet with `publishComponent`:
    ```html
    <router-outlet publishComponent></router-outlet>
    ```
> This works on named outlets as well.

3. Inject `RouterOutletComponentBus` into your service/component and use the `instance()` or `changes()` methods.

[See complete API](API)

# How does it work?
The service is intended to be managed by the [`PublishComponentDirective`](LINK) but 








The Angular way of getting a hold of the component's instance would be to set 