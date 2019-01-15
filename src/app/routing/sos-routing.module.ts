import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';
import { SosComponent } from '../modulos/sos/sos/sos.component';

const routes: Routes = [
  {
    path: 'sos',
    component: SosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SosRoutingModule { }
