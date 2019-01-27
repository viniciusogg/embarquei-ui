import { Administrador } from './../modulos/core/model';
import { JwtHelper } from 'angular2-jwt';
import { Estudante } from '../modulos/core/model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { StorageDataService } from './storage-data.service';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';

@Injectable()
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;
  tipoUsuarioLogado: string;
  private usuarioEndpoint = `${environment.apiUrl}/usuarios`;

  constructor(private jwtHelperService: JwtHelper, private cookieService: CookieService,
      private storageDataService: StorageDataService,
      private httpClient: HttpClient,
      private errorHandlerService: ErrorHandlerService)
  {
    this.oauthTokenUrl = `${environment.apiUrl}/authenticate`;
    this.carregarToken();
  }

  temPermissao(tipoUsuario: string)
  {
    if (!localStorage.getItem('tipoUsuarioLogado'))
    {
      return this.getTipoUsuarioById(this.jwtPayload.sub)
        .then(tipoRetornado => {

          localStorage.setItem('tipoUsuarioLogado', tipoRetornado.tipo);

          return tipoUsuario === localStorage.getItem('tipoUsuarioLogado');
        })
        .catch(erro => {
          this.errorHandlerService.handle(erro);
        });
    }
    return tipoUsuario === localStorage.getItem('tipoUsuarioLogado');
  }

  temQualquerPermissao(tiposUsuariosPermitidos)
  {
    for (const tipoUsuario of tiposUsuariosPermitidos) {
      if (this.temPermissao(tipoUsuario)){
        return true;
      }
    }
    return false;
  }

  login(numeroCelular: string, senha: string): Promise<void>
  {
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Access-Control-Allow-Credentials', 'true')

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    //const body = `numeroCelular=${numeroCelular}&senha=${senha}`;
    const body = JSON.stringify({'numeroCelular': numeroCelular, 'senha': senha});

    return this.httpClient.post(this.oauthTokenUrl, body, httpOptions)
      .toPromise()
      .then(response => {
        this.armazenarToken(response['access_token']);
      })
      .catch(response => {
        // if (response.status === 401){
          // const responseJson = response;
          // console.log(response);

          // this.errorHandlerService.handle(response);

          // if (responseJson.devError === 'invalid_credentials'){
          //   return Promise.reject('Número do celular ou senha inválida!');
          // }
        // }
        return Promise.reject(response.error.userError);
      });
  }

  obterNovoAccessToken(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Headers': 'Content-Type',
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    let body: string;//JSON.stringify ({});

    console.log('Obtendo novo access_token');

    return this.httpClient.post(this.oauthTokenUrl, body, httpOptions )
      .toPromise()
      .then(response => {

        this.armazenarToken(response['access_token']);

        console.log('Novo Access token criado');

        // return Promise.resolve(null);
      })
      .then(() => {
        if(!this.storageDataService.usuarioLogado)
        {
          const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

          const tipoUsuarioLogado = localStorage.getItem('tipoUsuarioLogado');

          if(tipoUsuarioLogado === 'est')
          {
            this.httpClient.get(`${environment}/estudantes/${idUsuarioLogado}`)
              .toPromise()
              .then(response => {
                this.storageDataService.usuarioLogado = response as Estudante;
              })
              .catch(erro => this.errorHandlerService.handle(erro));
          }
          else if(tipoUsuarioLogado === 'admin')
          {
            this.httpClient.get(`${environment.apiUrl}/administradores/${idUsuarioLogado}`)
              .toPromise()
              .then(response => {
                this.storageDataService.usuarioLogado = response as Administrador;
              })
              .catch(erro => this.errorHandlerService.handle(erro));
          }

        }
      })
      .catch(response => {
        console.error('Erro ao renovar token', response);
        // this.errorHandlerService.handle(response);

        return Promise.resolve(null);
      });
  }

  private armazenarToken(token: string)
  {
    this.jwtPayload = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('embarquei-token', token);
    localStorage.setItem('idUsuarioLogado', this.jwtPayload.sub);
  }

  private carregarToken()
  {
    const token = localStorage.getItem('embarquei-token');

    if (token){
      this.armazenarToken(token);
    }
  }

  limparAccessToken()
  {
    localStorage.removeItem('embarquei-token');
    localStorage.removeItem('tipoUsuarioLogado');
    localStorage.removeItem('idUsuarioLogado');
    localStorage.removeItem('isUsuarioAtivo');
    this.cookieService.delete('refresh_token');
    this.jwtPayload = null;
    this.storageDataService.usuarioLogado = null;
    this.storageDataService.tituloBarraSuperior = 'Embarquei'
  }

  interceptarRequisicao()
  {
    console.log('Interceptou...');

    const token = localStorage.getItem('embarquei-token');

    if(token && this.jwtHelperService.isTokenExpired(token))
    {
      console.log('Token expirado...');

      localStorage.removeItem('embarquei-token');
      // localStorage.removeItem('tipoUsuarioLogado');
      this.jwtPayload = null;
      this.obterNovoAccessToken();
    }
    return localStorage.getItem('embarquei-token');
  }

  isAccessTokenInvalido()
  {
    const token = localStorage.getItem('embarquei-token');

    const isInvalido = !token || this.jwtHelperService.isTokenExpired(token);

    return isInvalido;
  }

  getTipoUsuarioById(id): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.usuarioEndpoint}/tipo-usuario/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        return response;
      });
  }
}
