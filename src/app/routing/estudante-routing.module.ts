import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from '../modulos/usuarios/estudante/dashboard/dashboard.component';
import { EstudanteCadastroComponent } from '../modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { CheckinComponent } from '../modulos/usuarios/estudante/checkin/checkin.component';
import { AuthGuard } from './auth.guard';
import { EmAnaliseComponent } from '../modulos/usuarios/estudante/em-analise/em-analise.component';

const routes: Routes = [
  // {
  //   path: 'resumoDiario',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  //   data: { tiposUsuariosPermitidos: ['est'] }
  // },
  // {
  //   path: 'cadastro/estudante',
  //   component: EstudanteCadastroComponent
  // },
  // {
  //   path: 'checkin',
  //   component: CheckinComponent,
  //   canActivate: [AuthGuard],
  //   data: { tiposUsuariosPermitidos: ['est'] }
  // },
  // {
  //   path: 'emAnalise',
  //   component: EmAnaliseComponent
  // }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EstudanteRoutingModule { }
