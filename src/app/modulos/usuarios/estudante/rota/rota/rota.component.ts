import { Component, OnInit } from '@angular/core';

import { RotaService } from './../../../../../services/rota.service';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';
import { AuthService } from './../../../../../services/auth.service';

import { Estudante, TIPO_TRAJETO, Geolocalizacao, Trajeto, PontoParada } from './../../../../../modulos/core/model';
import { EstudanteService } from './../../../../../services/estudante.service';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ManipuladorTempo } from '../../../comum/manipulador-tempo';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-rota',
  templateUrl: './rota.component.html',
  styleUrls: ['./rota.component.css']
})
export class RotaComponent implements OnInit 
{
  geolocalizacaoMapa: Geolocalizacao;
  origemTrajetoIda: any = {lat: -0.00000000, lng: -10.00000000};
  origemTrajetoVolta: any = {lat: -0.00000000, lng: -10.00000000};
  destinoTrajetoIda: any = {lat: -0.00000000, lng: -10.00000000};
  destinoTrajetoVolta: any = {lat: -0.00000000, lng: -10.00000000};
  trajetoIda: Trajeto;
  trajetoVolta: Trajeto;
  pontosParadaIda: any[];
  pontosParadaVolta: any[];
  
  // Dados agregados do trajeto
  tempoTotalTrajetoIda: string;
  distanciaIda: number;
  partidaIda: string;
  chegadaIda: string;

  tempoTotalTrajetoVolta: string;
  distanciaVolta: number;
  partidaVolta: string;
  chegadaVolta: string;

  zoom: number = 15;
  drivingOptionsIda;
  drivingOptionsVolta;

  renderOptions: any = {
    draggable: false,
    suppressInfoWindows: true,
    markerOptions: {
      icon: {
        url: '/assets/icons/map-marker-final.png'
      }
    }
  }
  optimizeWaypoints = false;

  constructor(private rotaService: RotaService, private storageDataService: StorageDataService,
      private errorHandlerService: ErrorHandlerService, private estudanteService: EstudanteService) { }

  ngOnInit() 
  { 
    setTimeout(() => 
    {
      this.storageDataService.tituloBarraSuperior = 'Rota';
    });
    if (!this.storageDataService.usuarioLogado)
    {
      const estudanteId = localStorage.getItem('idUsuarioLogado');

      this.estudanteService.getById(estudanteId)
        .then(response => 
        {
          this.storageDataService.setUsuarioLogado(response);

          this.buscarRota();
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
    else
    {
      this.buscarRota();
    }
  }

  buscarRota()
  {
    const estudante: Estudante = this.storageDataService.usuarioLogado as Estudante;

    this.rotaService.filtrarPorInstituicaoCidade(estudante.curso.instituicaoEnsino.id, 
        estudante.endereco.cidade.id)
      .then(response => 
      {
        this.geolocalizacaoMapa = new Geolocalizacao();
        this.geolocalizacaoMapa.lat = new Number(response.cidade.geolocalizacao.lat).valueOf();
        this.geolocalizacaoMapa.lng = new Number(response.cidade.geolocalizacao.lng).valueOf();

        this.trajetoIda = response.trajetos
            .filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA && trajeto.ativado)[0];
        this.trajetoIda.pontosParada.sort((n1, n2) => n1.ordem - n2.ordem);

        this.trajetoVolta = response.trajetos
            .filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA && trajeto.ativado)[0];
        this.trajetoVolta.pontosParada.sort((n1, n2) => n1.ordem - n2.ordem);

        const geolocalizacaoOrigemIda = this.trajetoIda.pontosParada
            .filter(ponto => ponto.ordem === 1)[0].geolocalizacao;
        this.origemTrajetoIda = 
        {
          lat: new Number(geolocalizacaoOrigemIda.lat).valueOf(), 
          lng: new Number(geolocalizacaoOrigemIda.lng).valueOf()
        };//console.log(this.origemTrajetoIda);

        const geolocalizacaoOrigemVolta = this.trajetoVolta.pontosParada
            .filter(ponto => ponto.ordem === 1)[0].geolocalizacao;
        this.origemTrajetoVolta = 
        {
          lat: new Number(geolocalizacaoOrigemVolta.lat).valueOf(), 
          lng: new Number(geolocalizacaoOrigemVolta.lng).valueOf()
        };

        const geolocalizacaoDestinoIda = this.trajetoIda
            .pontosParada[this.trajetoIda.pontosParada.length - 1].geolocalizacao;
        this.destinoTrajetoIda = 
        {
          lat: new Number(geolocalizacaoDestinoIda.lat).valueOf(), 
          lng: new Number(geolocalizacaoDestinoIda.lng).valueOf()
        };

        const geolozalizacaoDestinoVolta = this.trajetoVolta
            .pontosParada[this.trajetoVolta.pontosParada.length - 1].geolocalizacao;
        this.destinoTrajetoVolta = 
        {
          lat: new Number(geolozalizacaoDestinoVolta.lat).valueOf(), 
          lng: new Number(geolozalizacaoDestinoVolta.lng).valueOf()
        }
        this.pontosParadaIda = this.criarWayPoints(this.trajetoIda.pontosParada);

        this.pontosParadaVolta = this.criarWayPoints(this.trajetoVolta.pontosParada);

        const partidaIda = this.trajetoIda.horarioTrajeto.partida;

        const partidaVolta = this.trajetoVolta.horarioTrajeto.partida;

        const departureTimeIda = moment(moment(new Date()).add(1, 'days').format('L').toString() + ' ' + partidaIda, 'DD/MM/YYYY HH:mm:ss').toDate();

        const departureTimeVolta = moment(moment(new Date()).add(1, 'days').format('L').toString() + ' ' + partidaVolta, 'DD/MM/YYYY HH:mm:ss').toDate();        

        // console.log(this.trajetoIda);

        this.drivingOptionsIda = 
        {
          departureTime: departureTimeIda,
          trafficModel: "pessimistic"
        }
        this.drivingOptionsVolta = 
        {
          departureTime: departureTimeVolta,
          trafficModel: "pessimistic"
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  gerarDadosTrajetoIda(event)
  {    
    const legs: any[] = event.routes[0].legs;

    let metros: number = 0;
    let segundos: number = 0;

    for (let leg of legs)
    {
      metros += leg.distance.value;
      segundos += leg.duration.value;
    }
    const quilometros = metros / 1000;

    let quantidadePontos: number = 0;

    for (let ponto of this.pontosParadaIda)
    {
      if (ponto.stopover)
      {
        quantidadePontos += 1;
      }
    }
    this.tempoTotalTrajetoIda = ManipuladorTempo
        .formatarHorarioTrajeto(ManipuladorTempo.incrementarTempoTotalTrajeto(quantidadePontos, segundos));
    this.distanciaIda = Number.parseFloat(quilometros.toFixed(1));
    this.partidaIda = this.trajetoIda.horarioTrajeto.partida;
    this.chegadaIda = ManipuladorTempo.calcularHoraChegada(this.partidaIda, this.tempoTotalTrajetoIda);
  }

  gerarDadosTrajetoVolta(event)
  {
    const legs: any[] = event.routes[0].legs;

    let metros: number = 0;
    let segundos: number = 0;

    for (let leg of legs)
    {
      metros += leg.distance.value;
      segundos += leg.duration.value;
    }
    const quilometros = metros / 1000;

    let quantidadePontos: number = 0;

    for (let ponto of this.pontosParadaIda)
    {
      if (ponto.stopover)
      {
        quantidadePontos += 1;
      }
    }
    this.tempoTotalTrajetoVolta = ManipuladorTempo
        .formatarHorarioTrajeto(ManipuladorTempo.incrementarTempoTotalTrajeto(quantidadePontos, segundos));
    this.distanciaVolta = Number.parseFloat(quilometros.toFixed(1));
    this.partidaVolta = this.trajetoVolta.horarioTrajeto.partida;
    this.chegadaVolta = ManipuladorTempo.calcularHoraChegada(this.partidaVolta, this.tempoTotalTrajetoVolta);
  }

  trajetoVoltaVisivel = false;

  carregarTrajetoVolta(event: MatTabChangeEvent)
  {
    if (event.tab.textLabel === 'trajetoVolta')
    {
      this.trajetoVoltaVisivel = true;
    }
  }

  private criarWayPoints(pontosParada: PontoParada[]): any[]
  {
    let wayPoints: any = [];

    for (let p of pontosParada)
    {
      const pontoParada: any = 
      {
        location: 
        {
          lat: new Number(p.geolocalizacao.lat).valueOf(), 
          lng: new Number(p.geolocalizacao.lng).valueOf()
        }, 
        stopover: p.nome !== '-'
      };
      wayPoints.push(pontoParada);
    }
    return wayPoints;
  }
}
