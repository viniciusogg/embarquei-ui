import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListaPresenca } from '../modulos/core/model';
import { environment } from './../../environments/environment';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ListaPresencaService {

  private listaPresencaUrl: string;

  constructor(private httpClient: HttpClient, private errorHandlerService: ErrorHandlerService) 
  { 
    this.listaPresencaUrl = `${environment.apiUrl}/listaPresenca`
  }

  getById(id): Promise<ListaPresenca>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: false
    };

    return this.httpClient.get(`${this.listaPresencaUrl}/${id}`, httpOptions)
      .toPromise()
      .then((response) => {
        return response as ListaPresenca;
      });
  }
}
