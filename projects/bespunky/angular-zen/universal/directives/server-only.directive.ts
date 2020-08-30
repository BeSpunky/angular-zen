import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[serverOnly]'
})
export class ServerOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformServer;
    }
}