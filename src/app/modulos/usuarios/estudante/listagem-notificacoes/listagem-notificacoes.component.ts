import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './../../../../services/storage-data.service';
import { Notificacao, TIPO_NOTIFICACAO } from './../../../../modulos/core/model';

@Component({
  selector: 'app-listagem-notificacoes',
  templateUrl: './listagem-notificacoes.component.html',
  styleUrls: ['./listagem-notificacoes.component.css']
})
export class ListagemNotificacoesComponent implements OnInit {

  notificacoes: Notificacao[] = [
    {
      id: '4', 
      tipo: TIPO_NOTIFICACAO.MUDANCA_ROTA, 
      descricao: 'Mudança na rota do veículo de transporte',
      dataEnvio: '20/02/2018',
      lida: false
    },
    {
      id: '3', 
      tipo: TIPO_NOTIFICACAO.CONFIRMACAO_PRESENCA, 
      descricao: 'Confirme sua presença hoje',
      dataEnvio: '20/02/2018',
      lida: true
    },
    {
      id: '2', 
      tipo: TIPO_NOTIFICACAO.CONFIRMACAO_PRESENCA, 
      descricao: 'Confirme sua presença hoje',
      dataEnvio: '19/02/2018',
      lida: true
    },
    {
      id: '1', 
      tipo: TIPO_NOTIFICACAO.MUDANCA_MOTORISTA, 
      descricao: 'Mudança do(a) motorista que conduz o veículo de transporte', // veículo de transporte
      dataEnvio: '10/02/2018',
      lida: true
    }
  ];

  constructor(private storageDataService: StorageDataService) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Notificações';
    })
  }

}

