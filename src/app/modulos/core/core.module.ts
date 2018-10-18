import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { JwtHelper } from 'angular2-jwt';

import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { AdminService } from './../usuarios/admin/admin.service';
import { EstudanteService } from './../usuarios/estudante/estudante.service';
import { StorageDataService } from './../../storage-data.service';
import { LogoutService } from './../seguranca/logout.service';

import { NaoAutorizadoComponent } from './nao-autorizado.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [NaoAutorizadoComponent],
  exports: [
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    JwtHelper,
    ErrorHandlerService,
    AdminService,
    EstudanteService,
    StorageDataService
  ]
})
export class CoreModule { }
