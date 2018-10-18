import { Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from './../../../../environments/environment.prod';
import { Estudante } from './../../core/model';

@Injectable()
export class EstudanteService {

  estudantesUrl: string;

  constructor(private http: AuthHttp) {
    this.estudantesUrl = 'http://127.0.0.1:8000/api/estudantes/';
  }

  cadastrarEstudante(estudante: Estudante): Promise<Estudante>
  {
    const body = JSON.stringify(estudante);

    return this.http.post(this.estudantesUrl, body, { withCredentials: true })
      .toPromise()
      .then(response => response.json());
  }
}
