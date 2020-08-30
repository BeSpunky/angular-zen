import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[nonWorkerUiOnly]'
})
export class NonWorkerUiOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformWorkerUi;
    }
}