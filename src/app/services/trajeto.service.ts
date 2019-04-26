import { environment } from './../../environments/environment';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trajeto, Rota } from '../modulos/core/model';

@Injectable()
export class TrajetoService {

  trajetoUrl: string;

  constructor(private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlerService)
  {
    this.trajetoUrl = `${environment.apiUrl}/trajetos`;
  }

  salvar(trajeto: Trajeto, rota: Rota)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    const novaRota: Rota = JSON.parse(JSON.stringify(rota));

    novaRota.trajetos = null;
    trajeto.rota = novaRota;    

    const body: any = JSON.stringify(trajeto);

    return this.httpClient.post(this.trajetoUrl, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response as Trajeto;
      });
  }

  getPontosParada(cidadeId, instituicaoId): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
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

  atualizar(trajeto: Trajeto, rota: Rota): Promise<Trajeto>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    const novaRota: Rota = JSON.parse(JSON.stringify(rota));

    novaRota.trajetos = null;
    trajeto.rota = novaRota;    

    const body: any = JSON.stringify(trajeto);

    return this.httpClient.put(`${this.trajetoUrl}/${trajeto.id}`, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response as Trajeto;
      });
  }

  atualizarStatus(trajeto: Trajeto, rota: Rota)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    const novaRota: Rota = JSON.parse(JSON.stringify(rota));

    novaRota.trajetos = null;
    trajeto.rota = novaRota;    

    const body: any = JSON.stringify(trajeto);

    return this.httpClient.put(`${this.trajetoUrl}/ativado/${trajeto.id}`, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response as Trajeto;
      });
  }

  remover(idTrajeto): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }  
    return this.httpClient.delete(`${this.trajetoUrl}/${idTrajeto}`, httpOptions)
      .toPromise()
      .then(() => 
      {
        Promise.resolve();
      });
  }
}
