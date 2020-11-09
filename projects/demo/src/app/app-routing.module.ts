import { NgModule             } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZenProjects   } from './content/all';
import { project, childProject       } from './utils/route-builders';

const [MainZenProject, ...ChildZenProjects] = ZenProjects;

const routes: Routes = [
    // Main zen project at root path along with its topics as root paths (i.e. / + /Core Module + /Async Module ...)
    ...project(MainZenProject),
    // Child zen projects as project path (e.g. /angular-zen-ux...)
    ...ChildZenProjects.map(childProject),
    // Anything else go to main zen project homepage
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
