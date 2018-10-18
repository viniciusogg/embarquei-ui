import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudanteCadastroComponent } from './estudante-cadastro/estudante-cadastro.component';
import { CheckinComponent } from './checkin/checkin.component';
import { AuthGuard } from './../../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'resumoDiario',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { tiposUsuariosPermitidos: ['est'] }
  },
  {
    path: 'cadastro/estudante',
    component: EstudanteCadastroComponent
  },
  {
    path: 'checkin',
    component: CheckinComponent,
    canActivate: [AuthGuard],
    data: { tiposUsuariosPermitidos: ['est'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EstudanteRoutingModule { }
