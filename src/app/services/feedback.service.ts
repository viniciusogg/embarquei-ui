import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../modulos/core/error-handler.service';
import { environment } from './../../environments/environment';
import { Feedback } from '../modulos/core/model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  feedbacksUrl: string;

  constructor(private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlerService)
  {
    this.feedbacksUrl = `${environment.apiUrl}/feedbacks`;
  }

  cadastrarFeedback(feedback: Feedback): Promise<Feedback>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    const body = JSON.stringify(feedback);

    return this.httpClient.post(this.feedbacksUrl, body, httpOptions)
      .toPromise()
      .then(response => {
        const feedback = response as Feedback;

        return feedback;
      });
  }

  getAll(): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.get(this.feedbacksUrl, httpOptions).toPromise()
      .then(response => {

        return response;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  getById(id): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    return this.httpClient.get(`${this.feedbacksUrl}/${id}`, httpOptions)
      .toPromise()
      .then(response => {
        const feedback = response as Feedback;

        return feedback;
      })
      .catch(erro => console.log(erro));
  }

  atualizar(id, dados): Promise<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    const body = JSON.stringify(dados);

    return this.httpClient.put(`${this.feedbacksUrl}/${id}`, body, httpOptions)
      .toPromise()
      .then((response) => {
        const feedback = response as Feedback;

        return feedback;
      });
  }
}
