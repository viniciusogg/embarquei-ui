import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
//import { AuthHttp } from 'angular2-jwt';
import { environment } from './../../../../environments/environment.prod';
import { Estudante } from './../../core/model';


@Injectable()
export class EstudanteService {

  estudantesUrl: string;

  constructor(private http: Http) {
    this.estudantesUrl = 'http://127.0.0.1:8000/api/usuarios/';
  }

  cadastrarEstudante(estudante: Estudante): Promise<Estudante>{

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const body = JSON.stringify(estudante);

    return this.http.post(this.estudantesUrl, body, { headers, withCredentials: false })
      .toPromise()
      .then(response => response.json());
  }
}
