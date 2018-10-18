import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { StorageDataService } from './../../storage-data.service';
import { environment } from './../../../environments/environment';
import { ErrorHandlerService } from './../core/error-handler.service';

@Injectable()
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;
  tipoUsuarioLogado: string;

  constructor(private jwtHelper: JwtHelper, private http: Http,
      private storageDataService: StorageDataService,
      private errorHandlerService: ErrorHandlerService)
  {
    this.oauthTokenUrl = `${environment.apiUrl}/authenticate`;
    this.carregarToken();
  }

  temPermissao(tipoUsuario: string)
  {
    if(this.jwtPayload)
    {
      if (!localStorage.getItem('tipoUsuarioLogado'))
      {
        return this.getTipoUsuarioById(this.jwtPayload.sub)
          .then(tipoRetornado => {

            // this.tipoUsuarioLogado = tipoRetornado;
            // console.log(tipoRetornado);

            localStorage.setItem('tipoUsuarioLogado', tipoRetornado.tipo);

            return tipoUsuario === localStorage.getItem('tipoUsuarioLogado');
          })
          .catch(erro => {
            this.errorHandlerService.handle(erro);
          });
      }
      // console.log(this.tipoUsuarioLogado);
      return tipoUsuario === localStorage.getItem('tipoUsuarioLogado');

      // return tipoUsuario === localStorage.getItem('tipoUsuarioLogado');
    }
    else
    {
      return false;
    }
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

  limparAccessToken()
  {
    localStorage.removeItem('embarquei-token');
    localStorage.removeItem('tipoUsuarioLogado');
    this.jwtPayload = null;
  }

  login(numeroCelular: string, senha: string): Promise<void>
  {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('Access-Control-Allow-Credentials', 'true')
    // headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEBy');

    //const body = `numeroCelular=${numeroCelular}&senha=${senha}`;
    const body = JSON.stringify({'numeroCelular': numeroCelular, 'senha': senha});

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.json().access_token);
      })
      .catch(response => {
        if (response.status === 401){
          const responseJson = response.json();

          if (responseJson.devError === 'invalid_credentials'){
            return Promise.reject('Número do celular ou senha inválida!');
          }
        }

        return Promise.reject(response);
      });
  }

  private armazenarToken(token: string)
  {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('embarquei-token', token); // ALTERAR DEPOIS PARA token-embarquei
  }

  private carregarToken()
  {
    const token = localStorage.getItem('embarquei-token');

    if (token){
      this.armazenarToken(token);
    }
  }

  obterNovoAccessToken(): Promise<void>
  {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEBy');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: false })
      .toPromise()
      .then(response => {

        this.armazenarToken(response.json().access_token);

        console.log('Novo Access token criado');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token', response);
        return Promise.resolve(null);
      });
  }

  isAccessTokenInvalido()
  {
    const token = localStorage.getItem('embarquei-token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  private getTipoUsuarioById(id): Promise<any>
  {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${localStorage.getItem('embarquei-token')}`);

    const usuariosUrl = 'http://127.0.0.1:8000/api/usuarios';

    return this.http.get(`${usuariosUrl}/tipo-usuario/${id}`, { headers, withCredentials: false })
      .toPromise()
      .then(response => {
        return response.json();
      });
  }
}
