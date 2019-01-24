import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class PontoParadaService {

  pontosParadaUrl: string;

  constructor(private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlerService)
  {
    this.pontosParadaUrl = `${environment.apiUrl}/pontosParada`;
  }

  getPontosParada(cidadeId, instituicaoId, rotaId): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.pontosParadaUrl}/${cidadeId}/${instituicaoId}/${rotaId}`, httpOptions)
      .toPromise()
      .then(response => {

        const resultado = {
          pontosParada: response
        };

        return resultado;
      });
  }

}
