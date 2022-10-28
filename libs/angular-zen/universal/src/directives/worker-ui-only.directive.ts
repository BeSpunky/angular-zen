import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on worker-ui platforms.
 *
 * @export
 * @class WorkerUiOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[workerUiOnly]'
})
export class WorkerUiOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformWorkerUi;
    }
}