import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment.prod';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Headers, URLSearchParams } from '@angular/http';
import { Usuario } from './../../core/model';

@Injectable()
export class AdminService {

  estudantesUrl: string;

  constructor(private http: AuthHttp) {
    this.estudantesUrl = `${environment.apiUrl}/estudantes`;
  }

  listarEstudantes(): Promise<any> {
    return this.http.get(this.estudantesUrl)
      .toPromise()
      .then(response => {

        const resultado = {
          estudantes: response.json()
        };

        return resultado;
      });
  }

}
