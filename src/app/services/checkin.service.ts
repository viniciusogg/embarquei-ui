import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

  private checkinUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService) 
  {
    this.checkinUrl = `${environment.apiUrl}/checkin`;
  }

  getByIdEstudante(id): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(`${this.checkinUrl}/estudante/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(erro => console.log(erro));
  }

  atualizar(id, dados): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    const body = dados;

    return this.httpClient.put(`${this.checkinUrl}/${id}`, body, httpOptions)
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
}
