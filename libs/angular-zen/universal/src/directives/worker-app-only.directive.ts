import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on worker-app platforms.
 *
 * @export
 * @class WorkerAppOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[workerAppOnly]'
})
export class WorkerAppOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformWorkerApp;
    }
}