import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { Injectable } from '@angular/core';

@Injectable()
export class InstituicaoEnsinoService {

  instituicaoUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService)
  {
    this.instituicaoUrl = `${environment.apiUrl}/instituicoesEnsino`;
  }

  getAll(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: false
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
}

