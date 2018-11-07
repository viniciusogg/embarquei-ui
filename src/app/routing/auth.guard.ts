import { EstudanteService } from './../services/estudante.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StorageDataService } from './../services/storage-data.service';
import { AuthService } from './../services/auth.service';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';

@Injectable()
export class AuthGuard implements CanActivate
{
  constructor(private authService: AuthService, private router: Router, private estudanteService: EstudanteService,
      private errorHandlerService: ErrorHandlerService, private storageDataService: StorageDataService)
  {}

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
            this.authService.limparAccessToken();
            this.errorHandlerService.handle('Sua sessão expirou, faça login para acessar o sistema');
            return false;
          }

          return this.verificarAcesso(next);

        });
    }
    // else if (next.data.tiposUsuariosPermitidos && !this.authService.temQualquerPermissao(next.data.tiposUsuariosPermitidos)) {
    //   this.router.navigate(['/acesso-negado']);
    //   return false;
    // }

    // return true;
    return this.verificarAcesso(next);
  }

  private verificarAcesso(next: ActivatedRouteSnapshot): boolean
  {

   // console.log(this.storageDataService.tipoUsuarioLogado);

    if(localStorage.getItem('embarquei-token') && this.storageDataService.tipoUsuarioLogado === undefined)
    {
      this.estudanteService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        this.storageDataService.usuarioLogado = usuario;
      })
      .then(() => {
        if (next.data.tiposUsuariosPermitidos && !this.authService.temQualquerPermissao(next.data.tiposUsuariosPermitidos))
        {
          this.router.navigate(['/acesso-negado']);
        }
        else if (this.storageDataService.usuarioLogado && !this.storageDataService.usuarioLogado.ativo)
        {
          this.router.navigate(['/emAnalise']);
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));

      return false;
    }

    /*if (next.data.tiposUsuariosPermitidos && !this.authService.temQualquerPermissao(next.data.tiposUsuariosPermitidos))
    {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
    else if (this.storageDataService.usuarioLogado && !this.storageDataService.usuarioLogado.ativo)
    {
      this.router.navigate(['/emAnalise']);
      return false;
    }*/
    return true;
  }
}
