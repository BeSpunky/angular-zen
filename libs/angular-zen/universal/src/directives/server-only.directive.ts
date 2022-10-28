import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on server platforms.
 *
 * @export
 * @class ServerOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[serverOnly]'
})
export class ServerOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformServer;
    }
}