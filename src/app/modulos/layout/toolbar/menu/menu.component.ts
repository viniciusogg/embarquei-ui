import { AdminService } from './../../../../services/admin.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageDataService } from './../../../../services/storage-data.service';
import { AuthService } from './../../../../services/auth.service';
import { EstudanteService } from './../../../../services/estudante.service';
import { Component, OnInit, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../../../services/logout.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { Usuario, Estudante } from '../../../core/model';
import { MatSidenav, MatDrawer } from '@angular/material';
import { UploadService } from '../../../../services/upload.service';
import { isUndefined, isNull } from 'util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewInit 
{//, OnChanges {
  @Input() drawerRef: MatDrawer;

  // linkFoto: string = null;

  constructor(private router: Router, private logoutService: LogoutService, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService, private estudanteService: EstudanteService,
      public storageDataService: StorageDataService,  private jwtHelperService: JwtHelperService,
      private adminService: AdminService, private uploadService: UploadService)
  {}

  ngOnInit() {}

  ngAfterViewInit() 
  {

  }

  abrirMenu()
  {

  }

  getTipoUsuarioLogado()
  {
    return localStorage.getItem('tipoUsuarioLogado');
  }

  redirecionar(url: string)
  {
    // if(this.drawerRef.o)
    this.drawerRef.close();
    this.router.navigate([url]);
  }

  logout()
  {
    if (this.jwtHelperService.isTokenExpired(localStorage.getItem('embarquei-token')))
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

  url()
  {
    // console.log(isUndefined(this.storageDataService.usuarioLogado));
    if (!isUndefined(this.storageDataService.usuarioLogado) && !isNull(this.storageDataService.usuarioLogado))
    {
      if (!isUndefined(this.storageDataService.usuarioLogado.linkFoto))
      {
        // this.linkFoto = this.storageDataService.usuarioLogado.linkFoto;
        return `url(${this.storageDataService.usuarioLogado.linkFoto})`;
      }
    }
  }

  opcoesMenuLateralAdmin = [
    {label: 'Início (em breve)', icone: 'home', url: '/', id: 'botaoInicio'},
    {label: 'Estudantes', icone: 'school', url: '/estudantes', id: 'botaoEstudantes'},
    {label: 'Motoristas', icone: 'people', url: '/motoristas', id: 'botaoCondutores'},
    {label: 'Rotas', icone: 'place', url: '/rota/cadastro', id: 'botaoRotas'},
    {label: 'Veículos Estudantis', icone: 'directions_bus', url: '/veiculos', id: 'botaoVeículosEstudantis'},
    {label: 'Notificações (em breve)', icone: 'notifications', url: '/', id: 'botaoNotificacoes'},
    {label: 'Renovação de cadastro (em breve)', icone: 'refresh', url: '/', id: 'botaoRenovacao'},
  ];

  opcoesMenuLateralEmAnalise = [];

  opcoesMenuLateralEstudante = [
    {label: 'Início', icone: 'home', url: '/resumoDiario', id: 'botaoInicio'},
    // {label: 'Check-in', icone: 'check_circle', url: '/checkin', id: 'botaoCheckin'}, // beenhere
    {label: 'Perfil', icone: 'account_circle', url: '/estudantes', id: 'botaoEstudantes'},
    {label: 'Notificações', icone: 'notifications', url: '/notificacoes', id: 'botaoNotificacoes'},
    // {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    // {label: 'Veículos de transporte', icone: 'directions_bus', url: '/', id: 'botaoVeiculos'},
    {label: 'Renovação de cadastro', icone: 'refresh', url: '/renovacaoCadastro', id: 'botaoRenovacao'},
    {label: 'SOS', icone: 'error_outline', url: '/sos', id: 'botaoCheckin'},
  ];

  opcoesMenuLateralMotorista = [
    {label: 'Início', icone: 'home', url: '/painelControle', id: 'botaoPainelControle'}
  ];

  opcoesMenuLateralSuper = [
    {label: 'Início', icone: 'home', url: '/admin/inicio', id: 'botaoAdminInicio'},
    {label: 'Municípios', icone: 'home', url: '/admin/municipios', id: 'botaoMunicipios'},
    {label: 'Instituicoes de ensino', icone: 'home', url: 'admin/instituicoes', id: 'botaoInstituicoes'}
  ];
}
