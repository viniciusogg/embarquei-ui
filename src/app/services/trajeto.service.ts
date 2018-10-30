import { environment } from './../../environments/environment';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TrajetoService {

  trajetoUrl: string;

  constructor(private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlerService)
  {
    this.trajetoUrl = `${environment.apiUrl}/trajetos`;
  }

  getPontosParada(cidadeId, instituicaoId): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: false
    };

    return this.httpClient.get(`${this.trajetoUrl}/${cidadeId}/${instituicaoId}`, httpOptions)
      .toPromise()
      .then(response => {

        const resultado = {
          trajetos: response
        };

        return resultado;
      });
  }
}
