import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listagem-notificacoes',
  templateUrl: './listagem-notificacoes.component.html',
  styleUrls: ['./listagem-notificacoes.component.css']
})
export class ListagemNotificacoesComponent implements OnInit {

  tituloNotificacao = 'Mudança de rota'
  dataNotificacao = "10/10/1990"
  tituloBotao = "CONFIRMAR"

  notificacoes = []

  constructor() { }

  ngOnInit() {
  }

}

