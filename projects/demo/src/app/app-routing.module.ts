import { NgModule             } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { topic         } from './utils/route-builders';
import { Topics        } from './topics/all';

const routes: Routes = [
    { path: '', component: HomeComponent },
    ...Topics.map(topic)
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
