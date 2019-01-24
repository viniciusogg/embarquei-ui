import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageDataService } from './storage-data.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LogoutService {

  tokensRevokeUrl: string;

  constructor(private authService: AuthService, private httpClient: HttpClient,
      private router: Router, private storageDataService: StorageDataService)
  {
    this.tokensRevokeUrl = `${environment.apiUrl}/logout`;
  }

  logout()
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.httpClient.delete(this.tokensRevokeUrl, httpOptions)
      .toPromise()
      .then(() => {
        this.authService.limparAccessToken();
        // localStorage.removeItem('tipoUsuarioLogado');
        // localStorage.removeItem('idUsuarioLogado');
        // this.authService.jwtPayload = null;
        // this.storageDataService.usuarioLogado = null;
        // this.router.navigate(['/login']);
      });
  }
}
