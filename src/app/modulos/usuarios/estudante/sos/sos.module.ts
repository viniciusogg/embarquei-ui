import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SosComponent } from './sos/sos.component';
import { RouterModule } from '@angular/router';
import { SosRoutingModule } from './../../routing/sos-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SosRoutingModule,
    MatCardModule,
    MatIconModule
  ],
  declarations: [SosComponent]
})
export class SosModule { }
