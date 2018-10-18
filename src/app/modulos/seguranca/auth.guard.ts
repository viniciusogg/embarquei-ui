import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
  {
    if (this.authService.isAccessTokenInvalido())
    {
      return this.authService.obterNovoAccessToken()
        .then(() => {
          if (this.authService.isAccessTokenInvalido())
          {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        });
    }
    else if (next.data.tiposUsuariosPermitidos && !this.authService.temQualquerPermissao(next.data.tiposUsuariosPermitidos)) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }

    return true;
  }
}
