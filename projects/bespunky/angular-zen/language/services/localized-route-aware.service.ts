// import { Injectable             } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// import { RouterOutletComponentService } from '../route-aware/router-outlet-component.service';
// import { RouteAwareService            } from '../route-aware/route-aware.service';
// import { LanguageIntegrationService   } from './language-integration.service';

// @Injectable()
// export abstract class LocalizedRouteAwareService extends RouteAwareService
// {
//     constructor(
//         protected language       : LanguageIntegrationService,
//                   router         : Router,
//                   route          : ActivatedRoute,
//                   outletComponent: RouterOutletComponentService
//     )
//     {
//         super(router, route, outletComponent);
        
//         if (this.language.enabled) this.initLanguageSupport();
//     }

//     private initLanguageSupport(): void
//     {
//         this.subscribe(this.language.changed, this.onLanguageChanged.bind(this));
//     }

//     /**
//      *
//      * @virtual
//      * @protected
//      * @param {*} lang
//      */
//     protected onLanguageChanged(lang: string): void { }
// }
