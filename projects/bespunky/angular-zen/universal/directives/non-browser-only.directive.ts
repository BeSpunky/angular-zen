import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[nonBrowserOnly]'
})
export class NonBrowserOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformBrowser;
    }
}