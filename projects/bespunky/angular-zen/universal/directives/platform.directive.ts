import { Directive, TemplateRef, ViewContainerRef, ElementRef, OnInit } from '@angular/core';

import { UniversalService } from '../services/universal.service';

@Directive()
export abstract class PlatformDirective implements OnInit
{
    constructor(private template: TemplateRef<ElementRef>, private viewContainer: ViewContainerRef, protected universal: UniversalService) { }

    ngOnInit()
    {
        this.shouldRender() ? this.viewContainer.createEmbeddedView(this.template) : this.viewContainer.clear();
    }

    protected abstract shouldRender(): boolean;
}