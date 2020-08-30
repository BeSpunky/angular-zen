import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[nonWorkerAppOnly]'
})
export class NonWorkerAppOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformWorkerApp;
    }
}