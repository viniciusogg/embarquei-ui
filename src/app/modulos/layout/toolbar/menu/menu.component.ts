import { AdminService } from './../../../../services/admin.service';
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
export class MenuComponent implements OnInit, AfterViewInit{//, OnChanges {

  @Input() drawerRef: MatDrawer;

  constructor(private router: Router, private logoutService: LogoutService, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService, private estudanteService: EstudanteService,
      private storageDataService: StorageDataService,  private jwtHelperService: JwtHelperService,
      private adminService: AdminService)
  {}

  ngOnInit()
  {
    //this.armazenarUsuarioNoDataService();
  }

  // ngOnChanges(changes: SimpleChanges)
  // {
  //   console.log('chamou onChanges');
  //   if(changes['isVisivel'] && this.router.url !== '/login' && this.router.url !== '/'
  //       && this.router.url !== '/cadastro/estudante')
  //   {
  //     console.log('changes1');
  //   }

  //   if(changes['isAutenticado'])
  //   {
  //     console.log('changes2');
  //   }
  // }

  ngAfterViewInit()
  {
    // this.armazenarUsuarioNoDataService();
  }

  // getArrayOpcoes()
  // {
  //   // if(this.isTelaEmAnalise())
  //   // {
  //   //   return this.opcoesMenuLateralEmAnalise;
  //   // }
  //   //else
  //   if(this.isAdmin())
  //   {
  //     return this.opcoesMenuLateralAdmin;
  //   }
  //   else if(localStorage.getItem('tipoUsuarioLogado') === 'est')
  //   {
  //   //   if(!this.storageDataService.usuarioLogado)
  //   //   {
  //   //     this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
  //   //       .then(usuario => {
  //           if(!this.storageDataService.usuarioLogado.ativo)
  //           {
  //             return this.opcoesMenuLateralEmAnalise;
  //           }
  //           return this.opcoesMenuLateralEstudante;
  //   //       })
  //   //       .catch(erro => this.errorHandlerService.handle(erro));
  //   //   }
  //   //   else if(!this.storageDataService.usuarioLogado.ativo)
  //   //   {
  //   //     return this.opcoesMenuLateralEmAnalise;
  //   //   }
  //   }
  //   // return this.opcoesMenuLateralEstudante;
  // }

  // isAdmin()
  // {
  //   return localStorage.getItem('tipoUsuarioLogado') === 'admin';
  // }

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

  getArrayOpcoes()
  {
    if(this.isAdmin())
    {
      return this.opcoesMenuLateralAdmin;
    }
    else if(localStorage.getItem('tipoUsuarioLogado') === 'est')
    {
      if(!this.storageDataService.usuarioLogado.ativo)
      {
        return this.opcoesMenuLateralEmAnalise;
      }
      return this.opcoesMenuLateralEstudante;
    }
  }

  isAdmin()
  {
    return localStorage.getItem('tipoUsuarioLogado') === 'admin';
  }

  opcoesMenuLateralAdmin = [
    {label: 'Início', icone: 'home', url: '/inicio', id: 'botaoInicio'},
    {label: 'Estudantes', icone: 'school', url: '/estudantes', id: 'botaoEstudantes'},
    {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    {label: 'Condutores', icone: 'people', url: '/', id: 'botaoCondutores'},
    {label: 'Veículos Estudantis', icone: 'directions_bus', url: '/', id: 'botaoVeículosEstudantis'},
    {label: 'Notificações', icone: 'notifications', url: '/', id: 'botaoNotificacoes'},
    {label: 'Renovação de cadastro', icone: 'refresh', url: '/', id: 'botaoRenovacao'},
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
}
