Angular's `ActivatedRoute` service only exposes the *type* of component and the name of the outlet it relates to. However, in some cases it is necessary to get a hold of the actual *instance* of the component activated for a certain route.

This service lets you:
1. Gain access to the instances of router activated components from anywhere in your app.
2. Observe changes to the active component in outlets.

[Why the service?](/Modules/RouterXModule/RouterOutletComponentBus#%60tldr%60-why-do-i-need-a-service%3F)

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
Internally, `RouterOutletComponentBus` keeps a map of `outlet name -> component instance`.  
When an outlet has no name, the service uses Angular's `PRIMARY_OUTLET` constant as a name.

When a component is published on the service, an observable is created and is mapped with the outlet's name.  
When a component is unpublished, that observable is completed and removed.

The service is intended to be managed by the [`PublishComponentDirective`](LINK), but you can manage it yourself using the `publishComponent()` and `unpublishComponent()` methods.

# `TLDR` Why do I need a service?
Before `@bespunky/angular-zen`, the common way of finding the activated component was to listen to the `activated` event on the relevant outlet:

```html
   <router-outlet (activate)="doSomethingWithComponent($event)"></router-outlet>
```

This is problematic for a few main reasons:
1. It is cumbersome to write - You have to use the above template syntax *and* have a method in your component to handle it.
2. Tight coupling - What happens if you need the instance of the activated component in some service? Your service now depends on the component hosting your outlet to notify it of the new instance.
3. No global access - `Router` and `ActivatedRoute` give you global access to the current state. The component instance is part of that state, but is not globally accessible.