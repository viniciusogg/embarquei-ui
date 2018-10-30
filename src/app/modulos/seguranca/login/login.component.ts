import { StorageDataService } from '../../../services/storage-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { EstudanteService } from '../../../services/estudante.service';

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
      private estudanteService: EstudanteService)
  {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.authService.login(this.loginForm.get('campoNumeroCelular').value,
        this.loginForm.get('campoSenha').value)
      .then()
      .then(() => {
        this.authService.getTipoUsuarioById(localStorage.getItem('idUsuarioLogado'))
          .then(tipoRetornado => {
            localStorage.setItem('tipoUsuarioLogado', tipoRetornado.tipo);

            if(localStorage.getItem('tipoUsuarioLogado') === 'est')
            {
              this.router.navigate(['/checkin']);
            }
            else if (localStorage.getItem('tipoUsuarioLogado') === 'admin'){
              this.router.navigate(['/estudantes']);
            }
          })
          .catch(erro => {
            console.log('Primeiro catch: ' + erro);
            this.errorHandlerService.handle(erro);
          });
      })
      .then(() => {
        // this.authService.armazenarUsuarioLogado();
        this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
          .then(usuario => {

            this.storageDataService.usuarioLogado = usuario;
            // console.log(this.storageDataService.usuarioLogado);
          })
          .catch(erro => {
            console.log('Segundo catch: ' + erro);
            this.errorHandlerService.handle(erro)
          });
      })
      .catch(erro => {
        // console.log('Terceiro catch: ' + erro);
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
    this.router.navigate(['/cadastro/estudante']);
  }

  private createForm()
  {
    this.loginForm = this.formBuilder.group({
      campoNumeroCelular: [null, [Validators.required]],
      campoSenha: [null, Validators.required],
    });
  }
}
