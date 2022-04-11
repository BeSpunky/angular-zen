import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on non-worker-ui platforms.
 *
 * @export
 * @class NonWorkerUiOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[nonWorkerUiOnly]'
})
export class NonWorkerUiOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformWorkerUi;
    }
}