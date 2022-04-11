import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on non-worker-app platforms.
 *
 * @export
 * @class NonWorkerAppOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[nonWorkerAppOnly]'
})
export class NonWorkerAppOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformWorkerApp;
    }
}