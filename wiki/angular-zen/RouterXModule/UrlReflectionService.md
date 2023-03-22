
Use this service to reflect on urls and extract their different parts.

This service provides:
1. Methods for quick reflection on any given url.
2. Properties for quick reflection on the currently navigated url.
3. The regular expressions it uses as public members for manual match-work.

[See full API](/docs/zen/injectables/UrlReflectionService.html)

## Host Urls
By default, the `hostUrl` and `fullUrl` properties use the current document's location to compose their values.
You can, however, specify a fixed value that will always replace the host part (e.g. 'https://www.example.com') by configuring `RouterXModule`:

```typescript
...
import { RouterXModule } from '@bespunky/angular-zen/router-x';

@NgModule({
    ...
    imports: [
        ...
        RouterXModule.forRoot({ hostUrl: 'https://some.url.com' }) // Maybe fetch from `environment`?
    ]
})
export class AppModule { }
```