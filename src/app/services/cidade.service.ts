import { Cidade } from './../modulos/core/model';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';
import { environment } from '../../environments/environment';

@Injectable()
export class CidadeService {

  cidadeUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService)
  {
    this.cidadeUrl = `${environment.apiUrl}/cidades`;
  }

  getAll(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    return this.httpClient.get(this.cidadeUrl, httpOptions).toPromise()
      .then(response => {

        const resultado = {
          cidades: response
        };
        return resultado;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  getCidadesComRotas(): Promise<Cidade[]>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    return this.httpClient.get(`${this.cidadeUrl}/comRota`, httpOptions)
      .toPromise()
      .then(response => {

        const cidades: Cidade[] = response as Cidade[];

        return cidades;
      });
  }

  getById(id): Promise<Cidade>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    }
    return this.httpClient.get(`${this.cidadeUrl}/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        return response as Cidade;
      });
  }
}
