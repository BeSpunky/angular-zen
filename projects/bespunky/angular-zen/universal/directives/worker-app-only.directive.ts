import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

@Directive({
    selector: '[workerAppOnly]'
})
export class WorkerAppOnlyDirective extends PlatformDirective
{
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformWorkerApp;
    }
}