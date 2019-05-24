import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { LoaderModule } from 'angular-zen';

@NgModule({
    declarations: [LoaderComponent],
    imports: [
        CommonModule,
        LoaderModule
    ],
    exports: [LoaderComponent]
})
export class CoreModule { }
