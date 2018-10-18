import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class LogoutService {

  tokensRevokeUrl: string;

  constructor(private http: AuthHttp, private authService: AuthService) {
    this.tokensRevokeUrl = `${environment.apiUrl}/logout`;
  }

  logout() { // MANDAR O TOKEN NO CABEÇALHO DA REQUISIÇÃO E NÃO NO BODY, COMO ESTÁ ATUALMENTE
    return this.http.post(this.tokensRevokeUrl, {withCredentials: true})
      .toPromise()
      .then(() => {
        this.authService.limparAccessToken();
      });
  }
}
