import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageDataService } from './../../../../services/storage-data.service';
import { CheckinService } from './../../../../services/checkin.service';
import { Checkin, VeiculoTransporte, Rota, Motorista, Estudante } from './../../../../modulos/core/model';
import { ErrorHandlerService } from './../../../../modulos/core/error-handler.service';
import { VeiculoTransporteService } from './../../../../services/veiculo-transporte.service';
import { RotaService } from './../../../../services/rota.service';
import { MotoristaService } from './../../../../services/motorista.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  checkin: Checkin;
  veiculoTransporte: VeiculoTransporte;
  rota: Rota;
  motorista: Motorista;

  textoCheckin = 'Carregando...';
  textoVeiculo = 'Carregando...';
  textoRota = 'Carregando...';
  textoCondutor = 'Carregando...';

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
  
      this.rotaService.filtrarPorInstituicaoCidade(idInstituicao, idCidade)
        .then((response) => 
        {
          if (!response.id)
          {
            this.textoRota = 'Rota indisponível';
          }
          else 
          {
            this.textoRota = response.nome;
          }
        })
        .catch(erro => this.errorHandlerService.handle(erro));

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

        if (checkin.status === 'CONFIRMADO' || checkin.status === 'EMBARCOU') 
        {
          this.textoCheckin = 'Presença confirmada';
        }
        else if (checkin.status === 'AGUARDANDO_CONFIRMACAO')
        {
          this.textoCheckin = 'Não confirmou presença';
        }
        // this.checkin = response;
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
          // this.veiculoTransporte = response;
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
          this.textoRota = 'Indisponível';
        }
        else 
        {
          this.textoRota = response.nome;
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
