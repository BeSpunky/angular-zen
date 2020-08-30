import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[workerUiOnly]'
})
export class WorkerUiOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformWorkerUi;
    }
}