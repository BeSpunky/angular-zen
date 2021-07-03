import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on non-server platforms.
 *
 * @export
 * @class NonServerOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[nonServerOnly]'
})
export class NonServerOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformServer;
    }
}