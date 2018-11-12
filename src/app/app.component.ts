import { RoutingService } from './services/routing.service';
import { AdminService } from './services/admin.service';
import { EstudanteService } from './services/estudante.service';
import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './services/storage-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(private estudanteService: EstudanteService, private storageDataService: StorageDataService,
      private adminService: AdminService, private routingService: RoutingService)
  {

  }

  ngOnInit()
  {
    this.armazenarUsuarioNoDataService();
  }

  private armazenarUsuarioNoDataService()
  {
    this.routingService.configurarRotas(localStorage.getItem('tipoUsuarioLogado'));

    if(localStorage.getItem('embarquei-token') && !this.storageDataService.getUsuarioLogado())
    {
      if(localStorage.getItem('tipoUsuarioLogado') === 'est')
      {
        this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(estudante => {
            this.storageDataService.setUsuarioLogado(estudante);
          })
          .catch(erro => console.log(erro));
      }
      else if(localStorage.getItem('tipoUsuarioLogado') === 'admin')
      {
        this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(usuario => {
            this.storageDataService.setUsuarioLogado(usuario);
          })
          .catch(erro => console.log(erro));
      }
    }
  }
}
