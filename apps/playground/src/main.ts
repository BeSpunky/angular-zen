import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouterX } from '@bespunky/angular-zen/router-x/navigation';
import { AppComponent } from './app/app.component';
import { theaterRoutes } from './app/theater.routes';
import { environment } from './environments/environment';

if (environment.production)
{
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouterX([theaterRoutes])
    ]
}).catch((err) => console.error(err));
