import { Directive } from '@angular/core';

import { PlatformDirective } from './platform.directive';

/**
 * Renders the marked element only on browser platforms.
 *
 * @export
 * @class BrowserOnlyDirective
 * @extends {PlatformDirective}
 */
@Directive({
    selector: '[browserOnly]'
})
export class BrowserOnlyDirective extends PlatformDirective
{
    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @returns {boolean}
     */
    protected shouldRender(): boolean
    {
        return this.universal.isPlatformBrowser;
    }
}