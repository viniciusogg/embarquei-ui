import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent, InstalacaoAppDialogComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TextMaskModule } from 'angular2-text-mask';
import { AuthService } from './../../services/auth.service';
import { AuthGuard } from './../../routing/auth.guard';

import { LogoutService } from './../../services/logout.service';
import { environment } from './../../../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('embarquei-token');
}

export function jwtOptionsFactory(authService) {
  return {
    whitelistedDomains: [environment.domain],
    // blacklistedRoutes: ['127.0.0.1:8000/api/authenticate'],
    tokenGetter: () => {
      return authService.interceptarRequisicao();
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // FormsModule,
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
  declarations: [LoginComponent, InstalacaoAppDialogComponent],
  providers: [
    AuthGuard,
    LogoutService
  ],
  entryComponents: [InstalacaoAppDialogComponent]
})
export class SegurancaModule { }
