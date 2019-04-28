import { AuthService } from './../../../../services/auth.service';
import { Component, OnInit, ChangeDetectorRef, Inject, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatTabChangeEvent } from '@angular/material';

import { StorageDataService } from './../../../../services/storage-data.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { CheckinService } from './../../../../services/checkin.service';
import { ListaPresencaService } from './../../../../services/lista-presenca.service';
import { EstudanteService } from './../../../../services/estudante.service';
import { UploadService } from './../../../../services/upload.service';
import { STATUS_CHECKIN, Checkin, Estudante, DIA_SEMANA, ListaPresenca } from './../../../core/model';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { AjudaDialog } from '../../comum/ajuda-dialog/ajuda-dialog';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit, AfterViewInit 
{
  mobileQuery: MediaQueryList;

  checkin: any;
  listasPresenca: ListaPresenca[];

  totalPresencasConfirmadas = 0;
  quantidadeAguardandoSaida = 0;
  quantidadeEmAula = 0;

  private _mobileQueryListener: () => void;

  private textoPresencaoNaoConfirmada = 'Você não confirmou sua presença.';
  private textoPresencaConfirmada = 'Legal, sua presença foi confirmada :)';
  private textoBotaoConfirmar = 'CONFIRMAR';
  private textoBotaoEmbarquei = 'EMBARQUEI';

  textoAjuda = ''; // this.textoPresencaoNaoConfirmada
  textoBotao = ''; // this.textoBotaoConfirmar
  isPresencaConfirmada = false;
  corBotao = 'accent';
  estaNoPonto = false;
  embarcou = false;

  exibirBotao = false;
  exibirCheckbox = false;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private dialog: MatDialog,
      private storageDataService: StorageDataService, private authServive: AuthService,
      private snackBar: MatSnackBar, private checkinService: CheckinService, private uploadService: UploadService,
      private errorHandlerService: ErrorHandlerService, private listaPresencaService: ListaPresencaService)
  {
    this.mobileQuery = media.matchMedia('(max-width: 500px)'); //700

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngAfterViewInit()
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Check-in';
    });
  }

  ngOnInit() 
  {
    const idEstudante = localStorage.getItem('idUsuarioLogado')

    this.checkinService.getByIdEstudante(idEstudante)
      .then((checkin) => {

        this.checkin = checkin;

        const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY'); // HH:mm
        const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');
        
        // CONFIRMOU A PRESENÇA NO DIA ANTERIOR MAS NÃO CLICOU EM 'EMBARQUEI'
        if (checkin.status !== STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO 
          && dataUltimaAtualizacao.isBefore(dataAtual))
        {
          // EXIBIÇÃO PADRÃO DOS ELEMENTOS (INICIO) e atualização do checkin para presença não confirmada
          this.atualizarCheckin(this.criarInstanciaCheckin(this.checkin.id, STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO))
            .then((response) => 
            {
              if (response)
              {
                this.alterarElementosParaAguardandoConfirmacao();
              }
            })
            .catch(erro => this.errorHandlerService.handle(erro));
        }
        else if (checkin.status === STATUS_CHECKIN.CONFIRMADO)
        {
          this.alterarElementosParaPresencaConfirmada();
        }
        else if (checkin.status === STATUS_CHECKIN.EMBARCOU)
        {
          this.alterarElementosParaEmbarcou();
        }
        else
        {
          this.alterarElementosParaAguardandoConfirmacao();
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  private alterarElementosParaPresencaConfirmada()
  {
    this.textoAjuda = this.textoPresencaConfirmada;
    this.textoBotao = this.textoBotaoEmbarquei;
    this.isPresencaConfirmada = true;
    this.corBotao = 'primary';
    this.embarcou = false;

    this.exibirBotao = true;
    this.exibirCheckbox = false;
  }

  private alterarElementosParaAguardandoConfirmacao()
  {
    this.textoAjuda = this.textoPresencaoNaoConfirmada;
    this.textoBotao = this.textoBotaoConfirmar;
    this.isPresencaConfirmada = false;
    this.estaNoPonto = false;
    this.embarcou = false;
    this.corBotao = 'accent';

    this.exibirBotao = true;
    this.exibirCheckbox = true;
  }

  private alterarElementosParaEmbarcou()
  {
    this.embarcou = true;
    this.textoAjuda = 'Não esqueça do cinto de segurança!';
    this.isPresencaConfirmada = true;

    this.exibirBotao = false;
    this.exibirCheckbox = false;
  }

  confirmarPresenca()
  {
    if (this.isPresencaConfirmada) 
    {
      this.embarquei();
    }
    else
    {
      this.atualizarCheckin(this.criarInstanciaCheckin(this.checkin.id, STATUS_CHECKIN.CONFIRMADO))
        .then((response) => {
          if (response)
          {
            this.alterarElementosParaPresencaConfirmada();
            this.snackBar.open('Presenca confirmada!', '', { duration: 3000});
          }
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
  }

  desistir()
  {
    this.atualizarCheckin(this.criarInstanciaCheckin(this.checkin.id, STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO))
      .then((response) => {
        if (response)
        {
          this.alterarElementosParaAguardandoConfirmacao();
        }
      })
      .catch();
  }

  private embarquei()
  {
    this.atualizarCheckin(this.criarInstanciaCheckin(this.checkin.id, STATUS_CHECKIN.EMBARCOU))
      .then((response) => {
        if (response)
        {
          this.alterarElementosParaEmbarcou();
  
          let snackBarRef = this.snackBar.open('Boa viagem!', 'DESFAZER', { duration: 9000});
      
          snackBarRef.onAction().subscribe(() => {
            this.alterarElementosParaPresencaConfirmada();
  
            this.atualizarCheckin(this.criarInstanciaCheckin(this.checkin.id, STATUS_CHECKIN.CONFIRMADO));
          });
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  private atualizarCheckin(checkin: Checkin): Promise<any>
  {
    return this.checkinService.atualizar(checkin.id, checkin);
  }

  getListaPresenca(event: MatTabChangeEvent)
  {
    if (event.tab.textLabel === 'listaPresenca')
    {
      const estudanteLogado: Estudante = this.storageDataService.usuarioLogado as Estudante;

      this.listaPresencaService.filtrarPorInstituicaoRota(estudanteLogado.curso.instituicaoEnsino.id)
        .then((response) => 
        {
          this.listasPresenca = response;
        })
        .then(() => 
        {
          for (let listaPresenca of this.listasPresenca)
          {
            for(let checkin of listaPresenca.checkins)
            {
              this.uploadService.getFile(checkin.estudante.foto.caminhoSistemaArquivos)
                .toPromise()
                .then((response) => 
                {
                  checkin.estudante.linkFoto = response;
                });
            }
            // this.gerarDadosResumoViagem(listaPresenca);
          }
          this.gerarDadosResumoViagem(this.listasPresenca);
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
  }

  private gerarDadosResumoViagem(listasPresenca: ListaPresenca[])
  {
    this.totalPresencasConfirmadas = 0;
    this.quantidadeAguardandoSaida = 0;
    this.quantidadeEmAula = 0;
    
    for (let listaPresenca of listasPresenca)
    {
      for (let checkin of listaPresenca.checkins) 
      {
        const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY');
        const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');
  
        if (checkin.status === STATUS_CHECKIN.EMBARCOU 
          && dataUltimaAtualizacao.isSame(dataAtual))
        {
          this.totalPresencasConfirmadas += 1;
          this.quantidadeAguardandoSaida += 1;
        }
        else if (checkin.status === STATUS_CHECKIN.CONFIRMADO && dataUltimaAtualizacao.isSame(dataAtual))
        {
          this.totalPresencasConfirmadas +=1;
        }
      }
    }
    this.quantidadeEmAula = this.totalPresencasConfirmadas - this.quantidadeAguardandoSaida;
  }

  formatarStatusCheckin(checkin: Checkin)
  {
    const dataUltimaAtualizacao = moment(checkin.dataUltimaAtualizacao, 'DD/MM/YYYY'); // HH:mm
    const dataAtual = moment(new Date().toLocaleDateString(), 'DD/MM/YYYY');

    if (checkin.status !== STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO 
      && dataUltimaAtualizacao.isBefore(dataAtual))
    {
      // return 'Não confirmou presença';
      return STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO;
    }/*
    else if (checkin.status === STATUS_CHECKIN.CONFIRMADO)
    {
      return 'Presença confirmada';
    }
    else if (checkin.status === STATUS_CHECKIN.EMBARCOU)
    {
      return 'Aguardando viagem de volta';
    }
    else if (checkin.status === STATUS_CHECKIN.AGUARDANDO_CONFIRMACAO)
    {
      return 'Não confirmou presença';
    }*/
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
  
  private criarInstanciaCheckin(id, status: STATUS_CHECKIN): Checkin
  {
    const checkin = new Checkin();
    checkin.id = id;
    checkin.status = status;
    checkin.dataUltimaAtualizacao = moment(new Date().toLocaleString(), 'DD/MM/YYYY HH:mm:ss').toDate();

    return checkin;
  }
}


@Component({
  selector: 'app-ajuda-checkin-dialog',
  templateUrl: './../../comum/ajuda-dialog/ajuda-dialog.component.html',
  styleUrls: [ './../../comum/ajuda-dialog/ajuda-dialog.component.css']
})
export class AjudaCheckinDialogComponent extends AjudaDialog 
{
  carregarTextoAjuda()
  {
    if (this.tipoAjuda === 'checkboxEstaNoPonto')
    {
      this.textoTitulo = 'Estou no meu ponto';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> <strong>1.</strong> Quando você marca a opção <strong>Estou no meu ponto</strong> ' +
        'significa que você está esperando o ônibus no seu ponto. </p> <p> <strong>2.</strong> Quando esta opção está marcada, você só ' +
        'deve apertar o botão <strong>CONFIRMAR</strong> quando o ônibus chegar no seu ponto.</p> <p> <strong>3.</strong> Ao fazer isso, você ' +
        'ajuda outros estudantes à visualizar por quais pontos o ônibus já passou.</p>');
    }
    else if (this.tipoAjuda === 'botaoEmbarquei')
    {
      this.textoTitulo = 'Botão EMBARQUEI';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> O botão <strong>EMBARQUEI</strong> deve ser apertado quando você ' +
        'estiver indo em direção ou ao entrar no seu ônibus, na viagem de volta para o seu município. </p> <p> <strong>ATENÇÃO</strong>, quando ' +
        'você aperta este botão, seu nome é marcado como <strong>aguardando viagem de volta</strong> na lista de presença do ônibus, indicando que você se ' + 
        'encontra dentro do veículo, além disso, vc só poderá confirmar sua presença novamente no dia seguinte. </p> <p> Portanto, para evitar ' +
        'que você seja esquecido na instituição de ensino ou que você fique impossibilitado de confirmar sua preseça, <strong>só aperte o ' + 
        'botão EMBARQUEI</strong> quando, de fato, você estiver indo em direção ao seu veículo de transporte ou ao embarcar nele. </p> ' + 
        '<p> Caso você aperte o botão por acidente, você pode desfazer esta ação apertando o botão <strong>DESFAZER</strong> que ficará ' + 
        'visível apenas por alguns segundos na parte inferior da tela. </p>');
    }
    else if (this.tipoAjuda === 'desistir')
    {
      this.textoTitulo = 'Botao DESISTIR';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Se você confirmou sua preseça com antecedencia, ' +
        'você poderá cancelar apertando a opção <strong>DESISTIR</strong>. Você deve apertar esse botão se: </p> ' +
        '<p> ' +
          '<strong>1.</strong> Você perder o horário do transporte estudantil (na ida para a instituição de ensino). <br>' +
          '<strong>2.</strong> Você não for voltar para o seu município utilizando o veículo estudantil. <br>' +
          '<strong>3.</strong> Você desistir de ir para a aula de última hora etc.' +
        '</p> ' +
        '<p> É essencial que, em caso de ocorrência de alguma destas situações descritas, você lembre ' +
        'de <strong>DESISTIR</strong> da viagem, do contrário, seu nome ficará na lista ' +
        'de presença do ônibus, fazendo com que, na volta para o município, o motorista espere ' + 
        'indeterminadamente por uma pessoa que não utilizou o transporte. </p>');
    }
    else if (this.tipoAjuda === 'botaoConfirmar')
    {
      this.textoTitulo = 'Botão CONFIRMAR';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> <strong> CONFIRMAR </strong> sua presença não ' + 
        'significa que o veículo de transporte vai te esperar caso você não esteja no seu ponto quando ele passar por lá.</p> ' + 
        '<p> Ao <strong> CONFIRMAR </strong> sua presença, você apenas garante que não será esquecido(a) na volta para casa, portanto, atenção ao ' + 
        'horário de partida para não perder o transporte na ida para a instituição de ensino. </p>');
    }
    else if (this.tipoAjuda === 'totalPresencasConfirmadas')
    {
      this.textoTitulo = 'Confirmaram presença';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> <strong> Presença confirmada </strong> <br> é a quantidade de estudantes que pretendem utilizar o transporte ' + 
        'estudantil hoje. </p>');
    }
    else if (this.tipoAjuda === 'quantidadeAguardandoSaida') 
    {
      this.textoTitulo = 'Aguardando a saída do veículo';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> <strong> Estudante aguardando </strong> <br> é a quantidade de estudantes que já estão no veículo estudantil aguardando ' + 
        'a viagem de volta para casa. </p> <p> Estudantes prontos para voltar ao município de origem tem status igual à <span class="status-aguardando-volta"> Aguardando viagem ' + 
        'de volta </span> na lista de estudantes. </p>');
    }
    else if (this.tipoAjuda === 'quantidadeEmAula')
    {
      this.textoTitulo = 'Ainda em aula';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> <strong>Estudante em aula</strong> <br> é a quantidade de estudantes que estão assistindo aula na instituição de ensino. </p>' + 
        '<p> <strong>1.</strong> O veículo estudantil voltará ao município de origem quando não houverem mais estudantes em aula. </p> <p> <strong>2.</strong> Estudantes em aula tem status igual à ' +
        '<span class="status-presenca-confirmada"> Em aula </span> na lista de estudantes. </p>')
    }
  }
}


@Component({
  selector: 'app-lembrete-dialog',
  templateUrl: 'lembrete-dialog/lembrete-dialog.component.html',
  styleUrls: [ 'lembrete-dialog/lembrete-dialog.component.css']
})
export class LembreteDialogComponent implements OnInit 
{
  segunda;
  terca;
  quarta;
  quinta;
  sexta;

  estudante: Estudante;

  constructor(private storageDataService: StorageDataService, @Inject(MAT_DIALOG_DATA) public data: any,
    private estudanteService: EstudanteService, private errorHandlerService: ErrorHandlerService,
    private snackBar: MatSnackBar) 
  {}

  ngOnInit()
  {
    this.estudante = this.storageDataService.usuarioLogado as Estudante;

    for (let dia of this.estudante.horariosSemanaisEstudante)
    {
      if (dia.diaSemana === DIA_SEMANA.SEGUNDA)
      {
        this.segunda = dia.temAula;
      }
      else if (dia.diaSemana === DIA_SEMANA.TERCA)
      {
        this.terca = dia.temAula;
      }
      else if (dia.diaSemana === DIA_SEMANA.QUARTA)
      {
        this.quarta = dia.temAula;
      }
      else if (dia.diaSemana === DIA_SEMANA.QUINTA)
      {
        this.quinta = dia.temAula;
      }
      else if (dia.diaSemana === DIA_SEMANA.SEXTA)
      {
        this.sexta = dia.temAula;
      }
    }
  }

  atualizarLembretes()
  {
    for (let dia of this.estudante.horariosSemanaisEstudante)
    {
      if (dia.diaSemana === DIA_SEMANA.SEGUNDA)
      {
        dia.temAula = this.segunda;
      }
      else if (dia.diaSemana === DIA_SEMANA.TERCA)
      {
        dia.temAula = this.terca;
      }
      else if (dia.diaSemana === DIA_SEMANA.QUARTA)
      {
        dia.temAula = this.quarta;
      }
      else if (dia.diaSemana === DIA_SEMANA.QUINTA)
      {
        dia.temAula = this.quinta;
      }
      else if (dia.diaSemana === DIA_SEMANA.SEXTA)
      {
        dia.temAula = this.sexta;
      }
    }
    this.estudanteService.atualizar(this.estudante.id, this.estudante)
      .then((response) => {
        let linkFoto = this.estudante.linkFoto;
        this.storageDataService.usuarioLogado = response;
        this.storageDataService.usuarioLogado.linkFoto = linkFoto;
        this.snackBar.open('Atualizado com sucesso', '', { duration: 3000});
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

}
