import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth.service';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';

@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(private authService: AuthService, private router: Router,
      private errorHandlerService: ErrorHandlerService)
  {}

  canActivate(next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
/*    if (this.authService.isAccessTokenInvalido())
    {
      return this.authService.obterNovoAccessToken()
        .then(() => {
          if (this.authService.isAccessTokenInvalido())
          {
            this.router.navigate(['/login']);
            this.authService.limparAccessToken();
            this.errorHandlerService.handle('Sua sessão expirou, faça login para acessar o sistema');
            return false;
          }

          return this.verificarAcesso(next);

        });
    }

    return this.verificarAcesso(next);*/
    return true;
  }

  private verificarAcesso(next: ActivatedRouteSnapshot): boolean
  {
    if (next.data.tiposUsuariosPermitidos && !this.authService.temQualquerPermissao(next.data.tiposUsuariosPermitidos)) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
    return true;
  }
}
