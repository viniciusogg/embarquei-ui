import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatDialog } from '@angular/material';

import { StorageDataService } from './../../../services/storage-data.service';
import { LembreteDialogComponent } from './../../usuarios/estudante/checkin/checkin.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenavRef') public sidenavRef: MatSidenav;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private dialog: MatDialog,
      private router: Router, private storageDataService: StorageDataService) {

    // se a largura da tela for 700 ou mais, o menu lateral fica fixo e
    // aparece ao lado do conteúdo se não, ele é ocultado e sobrepõe o conteúdo.

    // if (this.router.url !== '/login') {

      this.mobileQuery = media.matchMedia('(max-width: 1024px)'); // 700

      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    // }
  }

  ngOnInit()
  {
    // if (this.router.url !== '/login') { // /login
    //   if (this.mobileQuery.matches) {
    //     this.sidenavRef.close();
    //   }
    //   else {
    //     this.sidenavRef.open();
    //   }
    // }
  }

  ngAfterViewInit()
  {
    if (this.router.url !== '/login') { // /login
      if (this.mobileQuery.matches) {
        this.sidenavRef.close();
      }
      else {
        this.sidenavRef.open();
      }
    }
  }

  // redirecionar(url: string) {
  //   this.router.navigate([url]);
  // }

  ocultarToolbar() {
    // console.log(!this.router.url.includes('/recuperacao/senha/'));
    return !this.isTelaLogin();
  }

  ocultarMenu()
  {
    let isAutenticado = true;

    if(localStorage.getItem('embarquei-token') === undefined)
    {
      isAutenticado = false;
    }

    // return this.router.url !== '/cadastro/estudante' && !this.isTelaLogin()
    //     && this.router.url !== '/pagina-nao-encontrada' && isAutenticado;

    return this.router.url !== '/cadastro/estudante' && !this.isTelaLogin()
        && isAutenticado;
  }

  isTelaLogin() {
    return this.router.url === '/login';
  }

  alterarBackground() {
    if (this.isTelaLogin()) {
      return '#2979FF';
    }

    return 'unset';
  }

  abrirLembreteDialog()
  {
    this.dialog.open(LembreteDialogComponent, {
      height: '90%', width: '99%'//,
      // data: {
      //   ajuda: ajuda,
      // }
    });
  }
}
