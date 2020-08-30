import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[nonServerOnly]'
})
export class NonServerOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformServer;
    }
}