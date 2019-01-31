import { RoutingService } from './../../../services/routing.service';
import { AdminService } from './../../../services/admin.service';
import { StorageDataService } from '../../../services/storage-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { EstudanteService } from '../../../services/estudante.service';
import { Estudante } from '../../core/model';
import { UploadService } from '../../../services/upload.service';
import { MatDialog } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;

  //public mascaraMatricula = [/[a-zA-Z]/, /[a-zA-Z]/, '-', /\d/, /\d/, /\d/, /\d/];
  event = this.storageDataService.promptEvent;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService, public storageDataService: StorageDataService,
      private estudanteService: EstudanteService, private adminService: AdminService, private jwtHelper: JwtHelperService,
      private routingService: RoutingService, private uploadService: UploadService, private dialog: MatDialog,
      private activatedRoute: ActivatedRoute)
  {
    this.createForm();
  }

  ngOnInit() 
  {
    const token = localStorage.getItem('embarquei-token');
    const tipoUsuarioLogado = localStorage.getItem('tipoUsuarioLogado');

    if (token && !this.jwtHelper.isTokenExpired(token))
    {
      if (tipoUsuarioLogado === 'est')
      {
        this.router.navigate(['/resumoDiario']);
      }
      else if (tipoUsuarioLogado === 'admin')
      {
        this.router.navigate(['/estudantes']);
      }
      else if (tipoUsuarioLogado === 'mot')
      {
        this.router.navigate(['/painelControle']);
      }
    }
    this.storageDataService.promptEvent;
  }

  ngAfterViewInit()
  {
    setTimeout(() => {
      if (this.router.url === '/login')
      {
        this.dialog.open(InstalacaoAppDialogComponent, {
          height: '50%', 
          width: '99%',
          disableClose: true
        });
      }
      return true
    }, 10000);

    // setTimeout(function(){this.abrirDialogInstalacao()}, 25000);
  }

  login() {
    this.authService.login(this.loginForm.get('campoNumeroCelular').value, this.loginForm.get('campoSenha').value)
      // .then()
      .then(() => {
        this.authService.getTipoUsuarioById(localStorage.getItem('idUsuarioLogado'))
          .then(tipoRetornado => {
            localStorage.setItem('tipoUsuarioLogado', tipoRetornado.tipo);

            if(tipoRetornado.tipo === 'est')
            {
              let estudante: Estudante;

              this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
                .then(usuario => {
                  estudante = usuario;
                  this.storageDataService.usuarioLogado = usuario;
                  localStorage.setItem('isUsuarioAtivo', usuario.ativo);
                  this.routingService.configurarRotas(localStorage.getItem('tipoUsuarioLogado'));
                })
                .then(() => {
                  // console.log(estudante);
                  this.uploadService.getFile(estudante.foto.caminhoSistemaArquivos)
                    .toPromise()
                    .then((response) => {
                      this.storageDataService.usuarioLogado.linkFoto = response;
                    });
                })
                .then(() => {
                  if(this.storageDataService.usuarioLogado.ativo)
                  {
                    this.router.navigate(['/checkin']);
                  }
                  else
                  {
                    this.router.navigate(['/emAnalise']);
                  }
                })
                .catch(erro => {
                  this.errorHandlerService.handle(erro)
                });
            }
            else if(tipoRetornado.tipo === 'admin')
            {
              this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
                .then(usuario => {
                  this.storageDataService.usuarioLogado = usuario;
                  localStorage.setItem('isUsuarioAtivo', usuario.ativo);
                  this.routingService.configurarRotas(localStorage.getItem('tipoUsuarioLogado'));
                })
                .then(() => {
                  this.router.navigate(['/estudantes']);
                })
                .catch(erro => {
                  this.errorHandlerService.handle(erro)
                });
            }
          })
          .catch(erro => {
            this.errorHandlerService.handle(erro);
          });
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  abrirDialogInstalacao()
  {
    this.dialog.open(InstalacaoAppDialogComponent, {
      height: '55%', 
      width: '99%',
      disableClose: true
    });
  }

  private createForm()
  {
    this.loginForm = this.formBuilder.group({
      campoNumeroCelular: [null, [Validators.required]],
      campoSenha: [null, Validators.required],
    });
  }
}


@Component({
  selector: 'app-instalacao-app-dialog-component',
  template: `
  <mat-dialog-content class="mat-typography">
    <p cdkFocusInitial>Quando for solicitado, adicione o Embarquei na sua tela inicial ou  
      acesse as configurações do seu navegador e selecione a opção <strong>Adicionar à tela inicial</strong> :)</p>
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
    if (this.storageDataService.promptEvent)
    {
      this.storageDataService.promptEvent.prompt(); 
    }
  }

}