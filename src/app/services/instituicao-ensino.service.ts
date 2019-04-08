import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ErrorHandlerService } from './../modulos/core/error-handler.service';
import { InstituicaoEnsino } from '../modulos/core/model';
import { AdminService } from './admin.service';

@Injectable()
export class InstituicaoEnsinoService {

  private instituicaoUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService,
      private adminService: AdminService)
  {
    this.instituicaoUrl = `${environment.apiUrl}/instituicoesEnsino`;
  }

  getComRotas($cidadeId): Promise<InstituicaoEnsino[]>
  {
    const httpOptions = {
      headers: new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.instituicaoUrl}/comRota/${$cidadeId}`, httpOptions).toPromise()
      .then(response => 
        {
          let instituicoesEnsino: InstituicaoEnsino[] = response as InstituicaoEnsino[];
          return instituicoesEnsino ;
        });
  }

  getAll(): Promise<any[]>
  {
    const httpOptions = {
      headers: new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    }
    return this.httpClient.get(this.instituicaoUrl, httpOptions).toPromise()
      .then(response => {
        const instituicoes = response as InstituicaoEnsino[];
        return instituicoes;
      });
  }

  // Retorna instituições que não tem motoristas da cidade do usuário logado
  getSemMotoristaAssociado(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        return this.httpClient.get(`${this.instituicaoUrl}/semMotorista/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => {
            return response;
          });
      });
  }

  // Retorna instituições que não tem motoristas da cidade do usuário logado
  getSemVeiculoAssociado(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
      .then(usuario => {
        return this.httpClient.get(`${this.instituicaoUrl}/semVeiculo/${usuario.endereco.cidade.id}`, httpOptions)
          .toPromise()
          .then(response => {
            return response;
          });
      });
  }
}

