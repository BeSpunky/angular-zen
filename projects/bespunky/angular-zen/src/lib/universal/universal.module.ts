import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversalService } from './services/universal.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ]
})
export class UniversalModule
{
    constructor(@Optional() @SkipSelf() parentModule: UniversalModule)
    {
        if (parentModule)
        {
            throw new Error(
                'UniversalModule is already loaded. Import it in AppModule using forRoot(), then in child modules import it normally.');
        }
    }

    static forRoot(): ModuleWithProviders
    {
        return {
            ngModule: UniversalModule,
            providers: [UniversalService]
        }
    }
}
