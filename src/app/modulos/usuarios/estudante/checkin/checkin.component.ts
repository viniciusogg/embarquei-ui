import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

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

  textoAjuda = 'Você ainda não confirmou sua presença hoje.';
  textoBotao = 'CONFIRMAR';
  isPresencaConfirmada = false;
  embarcou = false;
  corBotao = 'accent';

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private dialog: MatDialog,
      private storageDataService: StorageDataService, private snackBar: MatSnackBar)
  {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    storageDataService.tituloBarraSuperior = 'Check in';
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

      this.snackBar.open('Presenca confirmada!', '', { duration: 3500});
    }
  }

  embarquei()
  {
    this.embarcou = true;
    this.textoAjuda = 'Não esqueça do cinto de segurança!';

    this.snackBar.open('Boa viagem!', 'DESFAZER', { duration: 3500});
  }

  abrirAjudaEstouNoPonto()
  {
    this.dialog.open(AjudaEstouNoPontoDialogComponent, {
      height: '95%', width: '99%'//,
      // data: {
      //   isAudiencia: this.isAudiencia,
      //   tabelaRef: tabelaRef,
      // }
    });
  }
}

@Component({
  selector: 'app-ajuda-estou-no-ponto-dialog',
  templateUrl: 'ajudaDialogs/ajudaEstouNoPonto/ajuda-estou-no-ponto-dialog.component.html',
  styleUrls: [ 'ajudaDialogs/ajudaEstouNoPonto/ajuda-estou-no-ponto-dialog.component.css']
})
export class AjudaEstouNoPontoDialogComponent implements OnInit {


  constructor(/*@Inject(MAT_DIALOG_DATA) public data: any*/) {

  }

  ngOnInit() {

  }

}
