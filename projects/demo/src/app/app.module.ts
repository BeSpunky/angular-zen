import { BrowserModule           } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule                } from '@angular/core';
import { CommonModule            } from '@angular/common';
import { FlexLayoutModule        } from '@angular/flex-layout';

import { AppRoutingModule         } from './app-routing.module';
import { AppMaterialModule        } from './app-material.module';
import { AppComponent             } from './app.component';
import { LibraryBenefitsComponent } from './components/library-benefits/library-benefits.component';
import { HomeComponent            } from './components/home/home.component';
import { TopicComponent           } from './components/topic/topic.component';
import { ExampleListComponent     } from './components/example-list/example-list.component';
import { ExampleComponent         } from './components/example/example.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LibraryBenefitsComponent,
        TopicComponent,
        ExampleListComponent,
        ExampleComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        AppRoutingModule,
        AppMaterialModule,
        FlexLayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
