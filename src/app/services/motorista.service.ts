import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Motorista } from '../modulos/core/model';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {

  motoristaEndpoint: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService,
      private adminService: AdminService) 
  {
    this.motoristaEndpoint = `${environment.apiUrl}/motoristas`;
  }

  cadastrar(motorista: Motorista): Promise<Motorista>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: false
    };

    const body = JSON.stringify(motorista);

    return this.httpClient.post(this.motoristaEndpoint, body, httpOptions)
      .toPromise()
      .then(response => {
        const motorista = response as Motorista;

        return motorista;
      });
  }

  getByCidade(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        return this.httpClient.get(`${this.motoristaEndpoint}/cidade/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => {
            return response;
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

    return this.httpClient.get(`${this.motoristaEndpoint}/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        const motorista = response as Motorista;

        return motorista;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
}
