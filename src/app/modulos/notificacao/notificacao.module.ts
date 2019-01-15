import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListagemNotificacoesComponent } from './listagem-notificacoes/listagem-notificacoes.component';
import { RouterModule } from '@angular/router';
import { NotificacaoRoutingModule } from './../../routing/notificacao-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NotificacaoRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [ListagemNotificacoesComponent]
})
export class NotificacaoModule { }
