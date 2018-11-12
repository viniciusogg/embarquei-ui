import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';

import { LoginComponent } from './login/login.component';
import { SegurancaRoutingModule } from './../../routing/seguranca-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { TextMaskModule } from 'angular2-text-mask';
import { AuthService } from './../../services/auth.service';
import { AuthGuard } from './../../routing/auth.guard';

import { LogoutService } from './../../services/logout.service';

// export function authHttpServiceFactory(authService: AuthService, http: Http, options: RequestOptions)
// {
//   const authConfig = new AuthConfig({
//     tokenName: 'embarquei-token',
//     globalHeaders: [
//       {'Content-Type': 'application/json'}
//     ],
//   });

//   return new EmbarqueiHttp(authService, authConfig, http, options);
// }

export function tokenGetter() {
  return localStorage.getItem('embarquei-token');
}

export function jwtOptionsFactory(authService) {
  return {
    whitelistedDomains: ['127.0.0.1:8000'],
    // blacklistedRoutes: ['127.0.0.1:8000/api/authenticate'],
    tokenGetter: () => {
      return authService.interceptarRequisicao();
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    SegurancaRoutingModule,

    ReactiveFormsModule,

    MatCardModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,

    TextMaskModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    })
  ],
  declarations: [LoginComponent],
  providers: [
    // {
    //   provide: AuthHttp,
    //   useFactory: authHttpServiceFactory,
    //   deps: [AuthService, Http, RequestOptions]
    // },
    AuthGuard,
    LogoutService
  ],

})
export class SegurancaModule { }
