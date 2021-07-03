import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on non-browser platforms.
 *
 * @export
 * @class NonBrowserOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[nonBrowserOnly]'
})
export class NonBrowserOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return !this.universal.isPlatformBrowser;
    }
}