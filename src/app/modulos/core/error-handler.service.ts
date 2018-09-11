import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './../seguranca/auth.service';
//import { NotAuthenticatedError } from '../seguranca/sasj-http';

@Injectable()
export class ErrorHandlerService {

  constructor(public snackBar: MatSnackBar, private router: Router) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    }
    /*else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou';
      this.router.navigate(['/login']);
    }*/
    else if (errorResponse instanceof Response && errorResponse.status >= 400
        && errorResponse.status <= 499) {

      let errors;

      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        errors = errorResponse.json();

        msg = errors[0].mensagemUsuario;
      }
      catch (e) { }

      console.error('Ocorreu um erro', errorResponse);
    }
    else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    this.snackBar.open(msg, '', {panelClass: ['snack-bar-error'], duration: 4000});
  }

}
