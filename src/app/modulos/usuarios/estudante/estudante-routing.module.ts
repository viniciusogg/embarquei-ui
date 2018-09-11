import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudanteCadastroComponent } from './estudante-cadastro/estudante-cadastro.component';
import { CheckinComponent } from './checkin/checkin.component';

const routes: Routes = [
  { path: 'resumoDiario', component: DashboardComponent },
  { path: 'cadastro/estudante', component: EstudanteCadastroComponent },
  { path: 'checkin', component: CheckinComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EstudanteRoutingModule { }
