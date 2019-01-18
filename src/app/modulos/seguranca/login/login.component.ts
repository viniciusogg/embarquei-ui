import { RoutingService } from './../../../services/routing.service';
import { AdminService } from './../../../services/admin.service';
import { StorageDataService } from '../../../services/storage-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { EstudanteService } from '../../../services/estudante.service';
import { Estudante } from '../../core/model';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  //public mascaraMatricula = [/[a-zA-Z]/, /[a-zA-Z]/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService, private storageDataService: StorageDataService,
      private estudanteService: EstudanteService, private adminService: AdminService,
      private routingService: RoutingService, private uploadService: UploadService)
  {
    this.createForm();
  }

  ngOnInit() {}

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


  // getUsuarioLogado()
  // {
    // const token = localStorage.getItem('embarquei-token');

    // const token = this.jwtHelper.decodeToken(localStorage.getItem('embarquei-token'));


    // const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');
    // console.log('MenuComponent - getUsuarioLogado() - idUsuario: ' + localStorage.getItem('idUsuarioLogado'));
    // return this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
    //   .then(usuario => {
        // this.usuario = usuario;
        // console.log('token:' + token.sub);zz
        // console.log(usuario);
        // Promise.resolve(usuario);

  //       this.usuario = usuario;

  //       console.log(this.usuario);
  //     })
  //     .catch(erro => this.errorHandlerService.handle(erro));
  // }

  novaConta(){
    this.router.navigate(['/estudante/cadastro']);
  }

  private createForm()
  {
    this.loginForm = this.formBuilder.group({
      campoNumeroCelular: [null, [Validators.required]],
      campoSenha: [null, Validators.required],
    });
  }
}
