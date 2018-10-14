import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { StorageDataService } from './../../../../storage-data.service';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
//                                       Sua presença não foi confirmada.
  private textoPresencaoNaoConfirmada = 'Você não confirmou sua presença.';
  private textoBotaoConfirmar = 'CONFIRMAR';

  textoAjuda = this.textoPresencaoNaoConfirmada;
  textoBotao = this.textoBotaoConfirmar;
  isPresencaConfirmada = false;
  estaNoPonto = false;
  embarcou = false;
  corBotao = 'accent';
  // corAjudaBotaoEmbarquei = 'primary';

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private dialog: MatDialog,
      private storageDataService: StorageDataService, private snackBar: MatSnackBar)
  {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    storageDataService.tituloBarraSuperior = 'Check-in';
  }

  ngOnInit() {
  }

  confirmarPresenca()
  {
    if (this.isPresencaConfirmada) {
      this.embarquei();
    }
    else{
      this.textoAjuda = 'Legal, sua presença foi confirmada :)'
      this.textoBotao = 'EMBARQUEI';
      this.isPresencaConfirmada = true;
      this.corBotao = 'primary';
      // this.corAjudaBotaoEmbarquei = 'accent';

      this.snackBar.open('Presenca confirmada!', '', { duration: 3500});
    }
  }

  desistir()
  {
    this.textoAjuda = this.textoPresencaoNaoConfirmada;
    this.textoBotao = this.textoBotaoConfirmar;
    this.isPresencaConfirmada = false;
    this.corBotao = 'accent';
  }

  embarquei()
  {
    this.embarcou = true;
    this.textoAjuda = 'Não esqueça do cinto de segurança!';

    this.snackBar.open('Boa viagem!', 'DESFAZER', { duration: 4500});
  }

  abrirAjuda(ajuda: string)
  {
    this.dialog.open(AjudaDialogComponent, {
      height: '70%', width: '99%',
      data: {
        ajuda: ajuda,
      }
    });
  }
}

@Component({
  selector: 'app-ajuda-dialog',
  templateUrl: 'ajuda-dialog/ajuda-dialog.component.html',
  styleUrls: [ 'ajuda-dialog/ajuda-dialog.component.css']
})
export class AjudaDialogComponent implements OnInit {

  ajuda: string;
  textoAjuda: SafeHtml;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer)
  {
    this.ajuda = data.ajuda;
  }

  ngOnInit()
  {
    this.carregarTextoAjuda();
  }

  carregarTextoAjuda()
  {
    if(this.ajuda === 'checkboxEstaNoPonto')
    {
      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('Quando você marca a opção <strong>Estou no meu ponto</strong> ' +
        'significa que você esta esperando o ônibus no seu ponto. Quando esta opção está marcada, você só ' +
        'deve apertar o botão <strong>CONFIRMAR</strong> quando o ônibus chegar no seu ponto. Ao fazer isso, você ' +
        'ajuda outros estudantes à visualizar por quais pontos o ônibus já passou.');
    }
    else if(this.ajuda === 'botaoEmbarquei')
    {
      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('O botão <strong>EMBARQUEI</strong> deve ser apertado quando você ' +
        'estiver indo em direção ou ao entrar no seu ônibus, na viagem de volta para o seu município. <strong>ATENÇÃO</strong>, quando ' +
        'você aperta este botão, seu nome é marcado como <strong>presente</strong> na lista de presença do ônibus. Portanto, para evitar ' +
        'que você seja esquecido na instituição de ensino, só aperte o botão <strong>EMBARQUEI</strong> ' +
        'quando, de fato, você estiver indo em direção ao seu ônibus ou ao embarcar nele. Caso você aperte o botão por acidente, ' +
        'você pode desfazer esta ação apertando o botão <strong>DESFAZER</strong> que aparecerá na parte inferior da tela.');
    }
    else if(this.ajuda === 'desistir')
    {
      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('Se você confirmou sua preseça com antecedencia, ' +
      'você poderá cancelar sua presença apertando a opção <strong>DESISTIR</strong>. Você deve apertar esse botão se: ' +
      'você perder o horário do ônibus; você não for voltar para o seu município no ônibus; você desistir de ir para a ' +
      'aula de última hora; etc. É essencial que, em caso de ocorrência de alguma dessas situações descritas, você lembre ' +
      'de <strong>DESISTIR</strong> da viagem, caso tenha confirmado sua presença, do contrário, seu nome ficará na lista ' +
      'de presença do ônibus, fazendo com que o motorista espere indeterminadamente por uma pessoa que não utilizou o transporte.');
    }
  }
}

