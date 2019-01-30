import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RoutingService } from './services/routing.service';
import { AdminService } from './services/admin.service';
import { EstudanteService } from './services/estudante.service';
import { StorageDataService } from './services/storage-data.service';
import { UploadService } from './services/upload.service';
import { Estudante } from './modulos/core/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private estudanteService: EstudanteService, private storageDataService: StorageDataService, 
      private dialog: MatDialog, private adminService: AdminService, 
      private routingService: RoutingService, private uploadService: UploadService)
  {}

  ngOnInit()
  {
    this.armazenarUsuarioNoDataService();

    if (this.storageDataService.promptEvent)
    {
      console.log('capturou');
      this.dialog.open(InstalacaoAppDialogComponent, {
        height: '75%', 
        width: '99%'
      });
    }
  }

  private armazenarUsuarioNoDataService()
  {
    this.routingService.configurarRotas(localStorage.getItem('tipoUsuarioLogado'));

    if(localStorage.getItem('embarquei-token') && !this.storageDataService.getUsuarioLogado())
    {
      if(localStorage.getItem('tipoUsuarioLogado') === 'est')
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

@Component({
  selector: 'app-instalacao-app-dialog-component',
  template: `
  <mat-dialog-content class="mat-typography">
    <p cdkFocusInitial>Quando for solicitado, adicione o Embarquei na sua tela inicial. A solicitação vai aparecer na parte inferior da tela :)</p>
  </mat-dialog-content>
  
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close color="primary" (click)="installPwa()"> ENTENDI </button>
  </mat-dialog-actions>
  `
})
export class InstalacaoAppDialogComponent {

  constructor(private storageDataService: StorageDataService) 
  {}

  installPwa (): void { 
    this.storageDataService.promptEvent.prompt(); 
  }

}