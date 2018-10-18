import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';

import { LoginComponent } from './login/login.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { TextMaskModule } from 'angular2-text-mask';
import { EmbarqueiHttp } from './embarquei-http';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { LogoutService } from './logout.service';

export function authHttpServiceFactory(authService: AuthService, http: Http, options: RequestOptions)
{
  const authConfig = new AuthConfig({
    tokenName: 'embarquei-token',
    globalHeaders: [
      {'Content-Type': 'application/json'}
    ],
  });

  return new EmbarqueiHttp(authService, authConfig, http, options);
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

    TextMaskModule
  ],
  declarations: [LoginComponent],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [AuthService, Http, RequestOptions]
    },
    AuthGuard,
    LogoutService
  ],

})
export class SegurancaModule { }
