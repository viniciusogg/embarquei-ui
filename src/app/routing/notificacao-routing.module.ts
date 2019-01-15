import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';
import { ListagemNotificacoesComponent } from '../modulos/notificacao/listagem-notificacoes/listagem-notificacoes.component';

const routes: Routes = [
  {
    path: 'notificacoes',
    component: ListagemNotificacoesComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotificacaoRoutingModule { }
