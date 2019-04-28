import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageDataService } from './../../../../services/storage-data.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-listagem-sos',
  templateUrl: './listagem-sos.component.html',
  styleUrls: ['./listagem-sos.component.css']
})
export class ListagemSosComponent implements OnInit {

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  sos: any = [
    {
      url: 'assets/samu.jpg',
      nome: 'Samu',
      numero: '192'
    },
    {
      url: 'assets/bombeiros-logotipo.png',
      nome: 'Bombeiros',
      numero: '193'
    },
    {
      url: 'assets/policia-militar-logotipo.png',
      nome: 'Polícia militar',
      numero: '190'
    }
  ];
  
  constructor(private storageDataService: StorageDataService, media: MediaMatcher,
      changeDetectorRef: ChangeDetectorRef) 
  { 
    this.mobileQuery = media.matchMedia('(max-width: 500px)'); //700

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'SOS';
    })
  }

  ngOnInit() {
  }

}
