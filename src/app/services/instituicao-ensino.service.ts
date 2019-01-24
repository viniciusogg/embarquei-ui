import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { InstituicaoEnsino } from '../modulos/core/model';
import { AdminService } from './admin.service';

@Injectable()
export class InstituicaoEnsinoService {

  instituicaoUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService,
      private adminService: AdminService)
  {
    this.instituicaoUrl = `${environment.apiUrl}/instituicoesEnsino`;
  }

  getAll(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(this.instituicaoUrl, httpOptions).toPromise()
      .then(response => {

        const resultado = {
          instituicoes: response
        };
        return resultado;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  getSemMotoristaAssociado(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        return this.httpClient.get(`${this.instituicaoUrl}/semMotorista/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => {
            return response;
          });
      });
  }
}

