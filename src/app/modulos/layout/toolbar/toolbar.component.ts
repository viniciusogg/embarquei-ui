import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { StorageDataService } from './../../../storage-data.service';

import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenavRef') public sidenavRef: MatSidenav;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  opcoesMenuLateralAdmin = [
    {label: 'Estudantes', icone: 'school', url: '/', id: 'botaoEstudantes'},
    {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    {label: 'Condutores', icone: 'people', url: '/', id: 'botaoCondutores'},
    {label: 'Veículos Estudantis', icone: 'directions_bus', url: '/', id: 'botaoVeículosEstudantis'},
    {label: 'Notificações', icone: 'notifications', url: '/', id: 'botaoNotificacoes'}
  ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
      private router: Router, private storageDataService: StorageDataService) {

    // se a largura da tela for 700 ou mais, o menu lateral fica fixo e
    // aparece ao lado do conteúdo se não, ele é ocultado e sobrepõe o conteúdo.

    // if (this.router.url !== '/login') {

      this.mobileQuery = media.matchMedia('(max-width: 700px)');

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

  redirecionar(url: string) {
    this.router.navigate([url]);
  }

  ocultarToolbar() {
    // console.log(!this.router.url.includes('/recuperacao/senha/'));
    return !this.isTelaLogin();
  }

  ocultarMenu() {
    return this.router.url !== '/cadastro/estudante' && !this.isTelaLogin();
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

  /*logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
        this.storageDataService.usuarioLogado = null;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }*/
}
