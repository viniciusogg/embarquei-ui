import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { JwtHelper } from 'angular2-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from './../../services/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { AdminService } from './../../services/admin.service';
import { EstudanteService } from './../../services/estudante.service';
import { StorageDataService } from './../../services/storage-data.service';
import { LogoutService } from './../../services/logout.service';
import { InstituicaoEnsinoService } from './../../services/instituicao-ensino.service';
import { CidadeService } from './../../services/cidade.service';
import { TrajetoService } from './../../services/trajeto.service';

import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { NaoEncontradoComponent } from './nao-encontrado.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [NaoAutorizadoComponent, NaoEncontradoComponent],
  exports: [
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    JwtHelper,
    CookieService,
    ErrorHandlerService,
    AdminService,
    EstudanteService,
    StorageDataService,
    JwtHelperService,
    LogoutService,
    TrajetoService,
    CidadeService,
    InstituicaoEnsinoService
  ]
})
export class CoreModule { }
