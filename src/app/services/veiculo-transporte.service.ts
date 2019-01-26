import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VeiculoTransporte } from '../modulos/core/model';
import { environment } from './../../environments/environment';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class VeiculoTransporteService 
{
  private veiculoEndPoint: string;

  constructor(private httpClient: HttpClient, private adminService: AdminService)
  {
    this.veiculoEndPoint = `${environment.apiUrl}/veiculosTransporte`;
  }

  cadastrar(veiculo): Promise<VeiculoTransporte>
  {
    const httpOptions = {
      headers: new HttpHeaders(
      {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    const body = JSON.stringify(veiculo);

    return this.httpClient.post(this.veiculoEndPoint, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        const veiculo = response as VeiculoTransporte;

        return veiculo;
      });
  }

  getById(idVeiculo): Promise<VeiculoTransporte>
  {
    const httpOptions = {
      headers: new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.veiculoEndPoint}/${idVeiculo}`, httpOptions)
      .toPromise()
      .then(response => 
      {
        const veiculo = response as VeiculoTransporte;

        return veiculo;
      });
  }

  getByCidade(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => 
      {
        return this.httpClient.get(`${this.veiculoEndPoint}/cidade/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => 
          {
            return response;
          });
      });
  }

  atualizar(veiculo): Promise<VeiculoTransporte>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    const body = JSON.stringify(veiculo);

    return this.httpClient.put(`${this.veiculoEndPoint}/${veiculo.id}`, body, httpOptions)
      .toPromise()
      .then(response => 
      {
        const veiculo = response as VeiculoTransporte;

        return veiculo;
      });
  } 

}
