import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Headers, URLSearchParams } from '@angular/http';
import { Usuario } from '../modulos/core/model';

@Injectable()
export class AdminService {

  estudantesUrl: string;

  constructor(private http: AuthHttp, private httpClient: HttpClient) {
    this.estudantesUrl = `${environment.apiUrl}/estudantes`;
  }

  listarEstudantes(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(this.estudantesUrl, httpOptions)
      .toPromise()
      .then(response => {

        const resultado = {
          estudantes: response
        };

        // console.log('Estudantes:');
        // console.log(response);

        return resultado;
      });
  }

}
