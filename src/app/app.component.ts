import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RoutingService } from './services/routing.service';
import { AdminService } from './services/admin.service';
import { EstudanteService } from './services/estudante.service';
import { StorageDataService } from './services/storage-data.service';
import { UploadService } from './services/upload.service';
import { Estudante, Motorista } from './modulos/core/model';
import { MotoristaService } from './services/motorista.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private estudanteService: EstudanteService, public storageDataService: StorageDataService, 
      private dialog: MatDialog, private adminService: AdminService, private motoristaService: MotoristaService,
      private routingService: RoutingService, private uploadService: UploadService)
  {

  }

  ngOnInit()
  {
    this.armazenarUsuarioNoDataService();

    // if (this.storageDataService.promptEvent)
    // {
    //   console.log('capturou');
    //   this.dialog.open(InstalacaoAppDialogComponent, {
    //     height: '75%', 
    //     width: '99%'
    //   });
    // }
  }

  private armazenarUsuarioNoDataService()
  {
    this.routingService.configurarRotas(localStorage.getItem('tipoUsuarioLogado'));

    if(localStorage.getItem('embarquei-token') && !this.storageDataService.getUsuarioLogado())
    {
      if (localStorage.getItem('tipoUsuarioLogado') === 'est')
      {
        let estudante: Estudante;

        this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(response => {
            estudante = response;
            this.storageDataService.setUsuarioLogado(response);
          })
          .then(() => {
            this.uploadService.getFile(estudante.foto.caminhoSistemaArquivos)
              .toPromise()
              .then((response) => {
                this.storageDataService.usuarioLogado.linkFoto = response;
              })
              .catch(erro => console.log(erro));
          })
          .catch(erro => console.log(erro));
      }
      else if (localStorage.getItem('tipoUsuarioLogado') === 'admin')
      {
        this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(usuario => {
            this.storageDataService.setUsuarioLogado(usuario);
          })
          .catch(erro => console.log(erro));
      }
      else if (localStorage.getItem('tipoUsuarioLogado') === 'mot')
      {
        let motorista: Motorista;

        this.motoristaService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(response => 
          {
            motorista = response;

            this.storageDataService.setUsuarioLogado(response);
          })
          .then(() => {
            if (motorista.foto)
            {
              this.uploadService.getFile(motorista.foto.caminhoSistemaArquivos)
                .toPromise()
                .then((response) => 
                {
                  this.storageDataService.usuarioLogado.linkFoto = response;
                })
                .catch(erro => console.log(erro));
            }
          })
          .catch(erro => console.log(erro));
      }
    }
  }
}
