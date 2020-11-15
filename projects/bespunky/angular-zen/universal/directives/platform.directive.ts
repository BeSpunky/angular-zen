import { Directive, TemplateRef, ViewContainerRef, ElementRef, OnInit } from '@angular/core';

import { UniversalService } from '../services/universal.service';

/**
 * Provides the base functionality for platform directives to render elements only on certain platforms.
 *
 * @export
 * @abstract
 * @class PlatformDirective
 * @implements {OnInit}
 */
@Directive()
export abstract class PlatformDirective implements OnInit
{
    constructor(private template: TemplateRef<ElementRef>, private viewContainer: ViewContainerRef, protected universal: UniversalService) { }

    /**
     * Checks whether the element should be rendered on the current platform and renders it.
     */
    ngOnInit()
    {
        this.shouldRender() ? this.viewContainer.createEmbeddedView(this.template) : this.viewContainer.clear();
    }

    /**
     * Checks whether the element should be rendered on the current platform.
     *
     * @protected
     * @abstract
     * @returns {boolean}
     */
    protected abstract shouldRender(): boolean;
}