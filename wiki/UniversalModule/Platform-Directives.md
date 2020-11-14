# Platform Directives
When you need to control platform specific rendering in your template, you can use the appropriate platform directive.
Platform directives provide you with an easy way of preventing rendering of specific elements, without injecting anything into your component.

# Supported Platform Directives
|Directive|Use|
|---------|---|
| `*browserOnly`      | Prevent element from rendering on non-browser platforms. |
| `*serverOnly`       | Prevent element from rendering on non-server platforms. |
| `*workerAppOnly`    | Prevent element from rendering on non-worker app platforms. |
| `*workerUiOnly`     | Prevent element from rendering on non-worker ui platforms. |
| `*nonBrowserOnly`   | Prevent element from rendering on browser platforms. |
| `*nonServerOnly`    | Prevent element from rendering on server platforms. |
| `*nonWorkerAppOnly` | Prevent element from rendering on worker app platforms. |
| `*nonWorkerUiOnly`  | Prevent element from rendering on worker ui platforms. |

# Usage
Import the `UniversalModule` and place the directives in your template.

The supported directives may be added to any element or component in your template.  
The following example will only render the `<div>` element on browser platforms:
```html
<div class="heavy-data-list" *browserOnly>...</div>
```

> Remember: These directives are structural directives. If you need to control the rendering of an element which already has an asterisk directive (*ngIf, *ngFor, etc.)  you will need to wrap your element with an `<ng-container>` and place the directive on the container:
> ```html
> <ng-container *nonServerOnly>
>     <div *ngIf="somethingIsCool">...</div>
> </ng-container>
> ```

# See Also
[Universal Service](/UniversalModule/UniversalService)