import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageDataService } from './../../../../services/storage-data.service';
import { CheckinService } from './../../../../services/checkin.service';
import { Checkin, VeiculoTransporte, Rota, Motorista, Estudante, STATUS_CHECKIN, TIPO_TRAJETO, PontoParada } from './../../../../modulos/core/model';
import { ErrorHandlerService } from './../../../../modulos/core/error-handler.service';
import { VeiculoTransporteService } from './../../../../services/veiculo-transporte.service';
import { RotaService } from './../../../../services/rota.service';
import { MotoristaService } from './../../../../services/motorista.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit 
{
  checkin: Checkin;
  veiculoTransporte: VeiculoTransporte;
  rota: Rota;
  motorista: Motorista;

  textoRota = 'Carregando...';
  textoCheckin = 'Carregando...';
  textoVeiculo = 'Carregando...';
  textoCondutor = 'Carregando...';
  descricaoIda = 'Carregando...';
  descricaoVolta = 'Carregando...';

  constructor(private storageDataService: StorageDataService, private router: Router, 
      private checkinService: CheckinService, private errorHandlerService: ErrorHandlerService,
      private veiculoTransporteService: VeiculoTransporteService, private rotaService: RotaService,
      private motoristaService: MotoristaService) 
  {}

  ngOnInit() 
  {
    setTimeout(() => {

      const estudante = this.storageDataService.usuarioLogado as Estudante;
      const idInstituicao = estudante.curso.instituicaoEnsino.id;
      const idCidade = estudante.endereco.cidade.id;
  
      // this.rotaService.filtrarPorInstituicaoCidade(idInstituicao, idCidade)
      //   .then((response) => 
      //   {
      //     if (!response.id)
      //     {
      //       this.textoRota = 'Rota indisponível';
      //     }
      //     else 
      //     {
      //       this.textoRota = response.nome;
      //     }
      //   })
      //   .catch(erro => this.errorHandlerService.handle(erro));
      this.getCheckin();
      this.getVeiculo(idInstituicao, idCidade);
      this.getMotorista(idInstituicao, idCidade);
      this.getRota(idInstituicao, idCidade);
    }, 3000);

    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Resumo diário';
    });
  }

  redirecionar(url: string)
  {
    this.router.navigate([url]);
  }

  getCheckin()
  {
    const idEstudante = localStorage.getItem('idUsuarioLogado');

    this.checkinService.getByIdEstudante(idEstudante)
      .then((response) => {
        let checkin = response;

        const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY'); // HH:mm
        const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');
        
        // CONFIRMOU A PRESENÇA NO DIA ANTERIOR MAS NÃO CLICOU EM 'EMBARQUEI' (BANCO DESATUALIZADO, SERÁ ATUALIZADO QUANDO O ESTUDANTE ACESSAR A PÁGINA DE LOGIN)
        if (checkin.status !== STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO 
          && dataUltimaAtualizacao.isBefore(dataAtual))
        {
          this.textoCheckin = 'Não confirmou presença';
        }
        else if (checkin.status === STATUS_CHECKIN.CONFIRMADO 
            || checkin.status === STATUS_CHECKIN.EMBARCOU) 
        {
          this.textoCheckin = 'Presença confirmada';
        }
        else if (checkin.status === STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO)
        {
          this.textoCheckin = 'Não confirmou presença';
        }
      })
      .catch(erro => console.log(this.errorHandlerService.handle(erro)));
  }

  getVeiculo(idInstituicao, idCidade)
  {
    this.veiculoTransporteService.filtrarPorInstituicaoCidade(idInstituicao, idCidade)
      .then((response) => 
      {
        if (!response.id)
        {
          this.textoVeiculo = 'Indisponível';
        }
        else 
        {
          if (response.tipo === 'ONIBUS')
          {
            this.textoVeiculo = 'Ônibus';
          }
          else if (response.tipo === 'VAN' )
          {
            this.textoVeiculo = 'Van';
          }
          this.textoVeiculo = this.textoVeiculo + ' ' + response.cor + ' ' + response.placa;
          this.veiculoTransporte = response;
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  getRota(idInstituicao, idCidade)
  {
    this.rotaService.filtrarPorInstituicaoCidade(idInstituicao, idCidade)
      .then((response) => 
      {
        if (!response.id)
        {
          this.descricaoIda = 'Indisponível';
          this.descricaoVolta = 'Indisponível';
        }
        else 
        {
          let pontosIda: PontoParada[];
          let pontosVolta: PontoParada[];
          
          for (let trajeto of response.trajetos)
          {
            if (trajeto.ativado && trajeto.tipo === TIPO_TRAJETO.IDA)
            {
              trajeto.pontosParada.sort((n1, n2) => n1.ordem - n2.ordem);

              pontosIda = trajeto.pontosParada;
            }
          }
          for (let trajeto of response.trajetos)
          {
            if (trajeto.ativado && trajeto.tipo === TIPO_TRAJETO.VOLTA)
            {
              trajeto.pontosParada.sort((n1, n2) => n1.ordem - n2.ordem);

              pontosVolta = trajeto.pontosParada;
            }
          }
          if (pontosIda.length > 0)
          {
            this.descricaoIda = '';

            for (let ponto of pontosIda)
            {
              if (ponto.nome !== '-')
              {
                this.descricaoIda += ponto.nome + ', ';
              }
            }
          }
          if (pontosVolta.length > 0)
          {
            this.descricaoVolta = '';

            for (let ponto of pontosVolta)
            {
              if (ponto.nome !== '-')
              {
                this.descricaoVolta += ponto.nome + ', ';
              }
            }
          }
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  getMotorista(idInstituicao, idCidade)
  {
    this.motoristaService.filtrarPorInstituicaoCidade(idInstituicao, idCidade)
      .then((response) => 
      {
        if (!response.id)
        {
          this.textoCondutor = 'Indisponível';
        }
        else 
        {
          this.textoCondutor = response.nome + ' ' + response.sobrenome;
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
}
