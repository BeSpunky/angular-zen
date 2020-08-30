import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[browserOnly]'
})
export class BrowserOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformBrowser;
    }
}