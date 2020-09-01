import { NgModule             } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ZenProjects   } from './content/all';
import { ZenProject    } from './content/angular-zen/project';
import { project       } from './utils/route-builders';

const routes: Routes = [
    { path: '', component: HomeComponent, data: ZenProject },
    ...ZenProjects.map(project),
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
