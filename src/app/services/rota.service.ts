import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';
import { environment } from './../../environments/environment';
import { Rota } from '../modulos/core/model';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class RotaService 
{
  private rotaEndpoint: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService, private adminService: AdminService) 
  {
    this.rotaEndpoint = `${environment.apiUrl}/rotas`;
  }

  cadastrar(rota: Rota): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    const body: any = JSON.stringify(rota);

    return this.httpClient.post(this.rotaEndpoint, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response;
      });
  }

  atualizar(rota: Rota): Promise<Rota>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    const body: any = JSON.stringify(rota);

    return this.httpClient.put(`${this.rotaEndpoint}/${rota.id}`, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        return response as Rota;
      });
  }

  buscarRotasPorCidade()
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Controll-Allow-headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => 
      {
        return this.httpClient.get(`${this.rotaEndpoint}/cidade/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => 
          {
            const rotas = response as Rota[];

            return rotas;
          });
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
