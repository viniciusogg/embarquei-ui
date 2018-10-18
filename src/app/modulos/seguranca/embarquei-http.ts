import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';

import { AuthConfig, AuthHttp, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { NotAuthenticatedError } from './not-authenticated-error';

@Injectable()
export class EmbarqueiHttp extends AuthHttp {

  constructor(private authService: AuthService, options: AuthConfig,
      http: Http, defOpts?: RequestOptions)
  {
    super(options, http, defOpts);
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.delete(url, options));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.patch(url, options));
  }

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.head(url, options));
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.options(url, options));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.get(url, options));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.post(url, body, options));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.fazerRequisicao(() => super.put(url, body, options));
  }

  // Intercepta as chamadas http para verificar se o access_token está válido
  // Caso esteja invalido, o refresh token é chamado para criar um novo access_token
  private fazerRequisicao(funcao: Function): Observable<Response>
  {
    if (this.authService.isAccessTokenInvalido()) {
      console.log('Requisição HTTP com access token inválido. Obtendo novo token...');

      const chamadaNovoAccessToken = this.authService.obterNovoAccessToken()
        .then(() => {
          if (this.authService.isAccessTokenInvalido()) {
            throw new NotAuthenticatedError();
          }
          return funcao().toPromise();
        });

      return Observable.fromPromise(chamadaNovoAccessToken);
    }
    else {
      return funcao();
    }
  }
}
