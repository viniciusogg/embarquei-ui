import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';
import { environment } from './../../environments/environment';
import { Rota } from '../modulos/core/model';

@Injectable({
  providedIn: 'root'
})
export class RotaService 
{
  private rotaEndpoint: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService) 
  {
    this.rotaEndpoint = `${environment.apiUrl}/rotas`;
  }

  cadastrar(rota: Rota)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.httpClient.post(`${this.rotaEndpoint}`, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response;
      });
  }

  buscarRotasPorCidade(cidadeId)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Controll-Allow-headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.httpClient.get(`${this.rotaEndpoint}/${cidadeId}`, httpOptions)
      .toPromise()
      .then(response => 
      {
        const rotas = response as Rota[];

        return rotas;
      });
  }

  buscarRotaPorId(id)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.httpClient.get(`${this.rotaEndpoint}/${id}`, httpOptions)
      .toPromise()
      .then(response => 
      {
        const rota = response as Rota;

        return rota;
      });
  }

  filtrarPorInstituicaoCidade(idInstituicao, idCidade)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.httpClient.get(`${this.rotaEndpoint}/${idInstituicao}/${idCidade}`, httpOptions)
      .toPromise()
      .then(response => 
      {
        const rota = response as Rota[];

        return rota;
      });
  }

}
