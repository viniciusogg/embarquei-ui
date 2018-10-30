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
      withCredentials: false
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
}
