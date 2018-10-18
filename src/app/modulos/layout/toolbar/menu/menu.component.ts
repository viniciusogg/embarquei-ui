import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../../seguranca/logout.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  opcoesMenuLateralAdmin = [
    {label: 'Estudantes', icone: 'school', url: '/', id: 'botaoEstudantes'},
    {label: 'Rotas', icone: 'place', url: '/', id: 'botaoRotas'},
    {label: 'Condutores', icone: 'people', url: '/', id: 'botaoCondutores'},
    {label: 'Veículos Estudantis', icone: 'directions_bus', url: '/', id: 'botaoVeículosEstudantis'},
    {label: 'Notificações', icone: 'notifications', url: '/', id: 'botaoNotificacoes'}
  ];

  constructor(private router: Router, private logoutService: LogoutService,
      private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {}

  redirecionar(url: string)
  {
    this.router.navigate([url]);
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
}
