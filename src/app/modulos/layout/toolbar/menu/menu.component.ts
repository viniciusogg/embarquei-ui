import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageDataService } from './../../../../services/storage-data.service';
import { AuthService } from './../../../../services/auth.service';
import { EstudanteService } from './../../../../services/estudante.service';
import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../../../services/logout.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { Usuario } from '../../../core/model';
import { MatSidenav, MatDrawer } from '@angular/material';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() drawerRef: MatDrawer;
  // @Input() isAutenticado: boolean;
  // @Input() usuario: Usuario;
  // usuario: Usuario;
  // idUsuarioLogado;

  opcoesMenuLateralAdmin = [
    {label: 'Check-in', icone: 'check', url: '/checkin', id: 'botaoCheckin'},
    {label: 'Estudantes', icone: 'school', url: '/estudantes', id: 'botaoEstudantes'},
    {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    {label: 'Condutores', icone: 'people', url: '/', id: 'botaoCondutores'},
    {label: 'Veículos Estudantis', icone: 'directions_bus', url: '/', id: 'botaoVeículosEstudantis'},
    {label: 'Notificações', icone: 'notifications', url: '/', id: 'botaoNotificacoes'}
  ];

  opcoesMenuLateralEmAnalise = [];

  opcoesMenuLateralEstudante = [
    {label: 'Início', icone: 'home', url: '/inicio', id: 'botaoInicio'},
    {label: 'Check-in', icone: 'check_circle', url: '/checkin', id: 'botaoCheckin'}, // beenhere
    {label: 'Perfil', icone: 'account_circle', url: '/estudantes', id: 'botaoEstudantes'},
    {label: 'Notificações', icone: 'notifications', url: '/', id: 'botaoNotificacoes'},
    {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    {label: 'Veículos de transporte', icone: 'directions_bus', url: '/', id: 'botaoVeiculos'},
    {label: 'Renovação de cadastro', icone: 'refresh', url: '/', id: 'botaoRenovacao'},
    {label: 'SOS', icone: 'error_outline', url: '/checkin', id: 'botaoCheckin'},
  ];

  constructor(private router: Router, private logoutService: LogoutService, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService, private estudanteService: EstudanteService,
      private storageDataService: StorageDataService,  private jwtHelperService: JwtHelperService)
  {}

  ngOnInit()
  {
    //this.armazenarUsuarioNoDataService();
  }

  ngOnChanges(changes: SimpleChanges)
  {
    // console.log('chamou onChanges - valor ocultarToolbar: ' + this.isVisivel);
    if(changes['isVisivel'] && this.router.url !== '/login' && this.router.url !== '/'
        && this.router.url !== '/cadastro/estudante')
    {

    }

    if(changes['isAutenticado'])
    {

    }
  }

  isAdmin()
  {
    return localStorage.getItem('tipoUsuarioLogado') === 'admin';
  }

  ngAfterViewInit()
  {
    /*if(localStorage.getItem('embarquei-token') && !this.storageDataService.tipoUsuarioLogado)
    {
      this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
        .then(usuario => {

          this.storageDataService.usuarioLogado = usuario;
          console.log('EXISTE TOKEN MAS USUÁRIO NÃO ESTÁ ARMAZENADO NO SERVICE');
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }*/
    this.armazenarUsuarioNoDataService();
  }

  private armazenarUsuarioNoDataService()
  {
    // console.log(this.storageDataService.tipoUsuarioLogado);

    if(localStorage.getItem('embarquei-token') && this.storageDataService.tipoUsuarioLogado === undefined)
    {
      console.log('É nulo');
      this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
        .then(usuario => {

          this.storageDataService.usuarioLogado = usuario;
          //console.log('EXISTE TOKEN MAS USUÁRIO NÃO ESTÁ ARMAZENADO NO SERVICE');
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
  }

  isTelaEmAnalise()
  {
    return this.router.url === '/emAnalise';
  }

  redirecionar(url: string)
  {
    // if(this.drawerRef.o)
    this.drawerRef.close();
    this.router.navigate([url]);
  }

  logout()
  {
    if(this.jwtHelperService.isTokenExpired(localStorage.getItem('embarquei-token')))
    {
      this.authService.limparAccessToken();
      this.router.navigate(['/login']);
    }
    else
    {
      this.logoutService.logout()
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
  }

}
