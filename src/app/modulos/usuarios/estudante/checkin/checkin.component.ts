import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
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
}
