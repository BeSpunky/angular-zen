import { NgModule } from '@angular/core';

import { MatToolbarModule     } from '@angular/material/toolbar';
import { MatCardModule        } from '@angular/material/card';
import { MatButtonModule      } from '@angular/material/button';
import { MatTooltipModule     } from '@angular/material/tooltip';
import { MatIconModule        } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const exported = [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressBarModule
];

@NgModule({
    imports: exported,
    exports: exported
})
export class AppMaterialModule { }