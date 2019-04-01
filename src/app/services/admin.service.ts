import { StorageDataService } from './storage-data.service';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { Administrador, Estudante } from './../modulos/core/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Headers, URLSearchParams } from '@angular/http';
import { Usuario } from '../modulos/core/model';

@Injectable()
export class AdminService {

  estudantesUrl: string;
  adminsUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService)
  {
    this.estudantesUrl = `${environment.apiUrl}/estudantes`;
    this.adminsUrl = `${environment.apiUrl}/administradores`
  }

  listarEstudantes(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        return this.httpClient.get(`${this.estudantesUrl}/cidade/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => {

            const resultado = {
              estudantes: response
            };

            return resultado;
          });
      });
  }

  getById(id): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.adminsUrl}/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        const administrador = response as Administrador;

        return administrador;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  atualizarStatusEstudante(id, dados): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    const body = dados;

    return this.httpClient.put(`${this.estudantesUrl}/ativo/${id}`, body, httpOptions)
      .toPromise()
      .then()
      .catch(erro => this.errorHandlerService.handle(erro));
  }

}
