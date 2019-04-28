import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { StorageDataService } from './../../../../services/storage-data.service';
import { AuthService } from './../../../../services/auth.service';
import { UploadService } from './../../../../services/upload.service';
import { ListaPresencaService } from './../../../../services/lista-presenca.service';
import { ErrorHandlerService } from './../../../../modulos/core/error-handler.service';
import { ListaPresenca, STATUS_CHECKIN, Checkin, Motorista, InstituicaoEnsino, TIPO_TRAJETO } from './../../../../modulos/core/model';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { AjudaCheckinDialogComponent } from '../../estudante/checkin/checkin.component';
import { VeiculoTransporteService } from './../../../../services/veiculo-transporte.service';
import { MotoristaService } from './../../../../services/motorista.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RotaService } from './../../../../services/rota.service';

@Component({
  selector: 'app-lista-presenca',
  templateUrl: './lista-presenca.component.html',
  styleUrls: ['./lista-presenca.component.css']
})
export class ListaPresencaComponent implements OnInit 
{
  instituicaoForm: FormGroup;

  private motorista: Motorista;
  listasPresenca: ListaPresenca[];
  instituicoesEnsino: InstituicaoEnsino[];

  totalPresencasConfirmadas = 0;
  quantidadeAguardandoSaida = 0;
  quantidadeEmAula = 0;

  constructor(private dialog: MatDialog, private veiculoTransporteService: VeiculoTransporteService, 
      private rotaService: RotaService, private storageDataService: StorageDataService, 
      private formBuilder: FormBuilder, private uploadService: UploadService, 
      private motoristaService: MotoristaService, private errorHandlerService: ErrorHandlerService, 
      private listaPresencaService: ListaPresencaService) 
  { }

  ngOnInit() 
  {
    setTimeout(() => 
    {
      this.storageDataService.tituloBarraSuperior = 'Listas de presença';
    });
    this.motorista = this.storageDataService.usuarioLogado as Motorista;
    
    this.instituicaoForm = this.formBuilder.group(
    {
      campoInstituicaoEnsino: [null, Validators.required]
    }); 
    if (!this.motorista)
    {
      this.motoristaService.getById(localStorage.getItem('idUsuarioLogado'))
        .then(response => 
        {
          this.motorista = response;

          this.getListaPresenca();
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
    else
    {
      this.getListaPresenca();
    }
  }

  getListaPresenca()
  {
    let listasPresenca: ListaPresenca[];

    this.listaPresencaService.filtrarPorInstituicaoMotorista(this.motorista.id)
      .then((response) => 
      {
        // this.listasPresenca = response;
        listasPresenca = response;
      })
      .then(() => 
      {
        let contador = 0;
        
        for (let listaPresenca of listasPresenca)
        {
          // Exibe apenas lista de presença onde o horário de chegada do trajeto de volta
          // é posterior ao horário atual. 
          this.rotaService
              .filtrarPorInstituicaoCidade(listaPresenca.instituicaoEnsino.id, this.motorista.cidade.id)
            .then(response => 
            {
              listaPresenca.horarioPartidaMunicipioOrigem = response.trajetos
                  .filter(trajeto => trajeto.ativado && trajeto.tipo === TIPO_TRAJETO.IDA)[0].horarioTrajeto.partida;

              contador += 1;

              const trajetoVolta = response.trajetos
                  .filter(trajeto => trajeto.ativado && trajeto.tipo === TIPO_TRAJETO.VOLTA)[0];
              
              const horaChegada = moment(trajetoVolta.horarioTrajeto.chegada, 'HH:mm');
              const horaAtual = moment(new Date().toLocaleTimeString(), 'HH:mm');

              // Verifica se a hora de chegada é posterior à hora atual, ou seja
              // o veículo ainda está em atividade?
              // Ex. -> horaChegada - 23:00 / horaAtual - 21:40 = true, entra no IF
              if (horaChegada.isSameOrAfter(horaAtual))
              {         
                listaPresenca.horarioAtivo = true;

                for (let checkin of listaPresenca.checkins)
                {
                  this.uploadService.getFile(checkin.estudante.foto.caminhoSistemaArquivos)
                    .toPromise()
                    .then((responseImagem) => 
                    {
                      checkin.estudante.linkFoto = responseImagem;
                    });
                }
                this.gerarDadosResumoViagem(listaPresenca);
              }
              else
              {
                listaPresenca.horarioAtivo = false;
              }
              this.gerarTotalPresencasConfirmadas(listaPresenca);
            })
            .then(() => 
            { // ORDENANDO LISTAS PELO HORÁRIO DE PARTIDA PARA CADA INSTITUIÇÃO
              if (contador === listasPresenca.length)
              {
                listasPresenca.sort((n1, n2) => 
                    Number(n1.horarioPartidaMunicipioOrigem.split(':')[0]).valueOf() < 
                    Number(n2.horarioPartidaMunicipioOrigem.split(':')[0]).valueOf() ? -1 : 1);
              }
            })
            .catch(erro => this.errorHandlerService.handle(erro));
        }
        this.listasPresenca = listasPresenca;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
  
  private gerarDadosResumoViagem(listaPresenca: ListaPresenca)
  {
    for (let checkin of listaPresenca.checkins) 
    {
      const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY');
      const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');

      if (checkin.status === STATUS_CHECKIN.EMBARCOU 
        && dataUltimaAtualizacao.isSame(dataAtual))
      {
        // this.totalPresencasConfirmadas += 1;
        this.quantidadeAguardandoSaida += 1;
      }
      // else if (checkin.status === STATUS_CHECKIN.CONFIRMADO && dataUltimaAtualizacao.isSame(dataAtual))
      // {
      //   this.totalPresencasConfirmadas +=1;
      // }
    }
    this.quantidadeEmAula = this.totalPresencasConfirmadas - this.quantidadeAguardandoSaida;
  }

  private gerarTotalPresencasConfirmadas(listaPresenca: ListaPresenca)
  {
    for (let checkin of listaPresenca.checkins) 
    {
      const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY');
      const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');

      if (checkin.status === STATUS_CHECKIN.EMBARCOU 
        && dataUltimaAtualizacao.isSame(dataAtual))
      {
        this.totalPresencasConfirmadas += 1;
      }
      else if (checkin.status === STATUS_CHECKIN.CONFIRMADO && dataUltimaAtualizacao.isSame(dataAtual))
      {
        this.totalPresencasConfirmadas +=1;
      }
    }
  }

  formatarStatusCheckin(checkin: Checkin)
  {
    const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY'); // HH:mm
    const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');

    if (checkin.status !== STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO 
      && dataUltimaAtualizacao.isBefore(dataAtual))
    {
      return STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO;
    }
  }

  abrirAjuda(tipoAjuda: string)
  {
    this.dialog.open(AjudaCheckinDialogComponent, {
      height: tipoAjuda === 'checkboxEstaNoPonto' ? '75%' : (tipoAjuda === 'quantidadeEmAula' ||
        tipoAjuda === 'quantidadeAguardandoSaida' ? '71%' : 
        (tipoAjuda === 'totalPresencasConfirmadas' ? '48%' : '90%') ), 
      width: '99%',
      data: {
        tipoAjuda: tipoAjuda,
      }
    });
  }
}
