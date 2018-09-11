import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  //public mascaraMatricula = [/[a-zA-Z]/, /[a-zA-Z]/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService,
      private errorHandlerService: ErrorHandlerService)
  {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.authService.login(this.loginForm.get('campoNumeroCelular').value,
        this.loginForm.get('campoSenha').value)
      .then(() => {
        this.router.navigate(['/estudantes']); // Decidir para onde navegar de acordo com o tipo de usuário no payload do token
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

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
