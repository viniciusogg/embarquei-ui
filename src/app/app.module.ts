import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './modulos/core/core.module';
import { LayoutModule } from './modulos/layout/layout.module';
import { SegurancaModule } from './modulos/seguranca/seguranca.module';
import { EstudanteModule } from './modulos/usuarios/estudante/estudante.module';
import { AdminModule } from './modulos/usuarios/admin/admin.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,

    CoreModule,
    LayoutModule,
    SegurancaModule,
    EstudanteModule,
    AdminModule
  ],
  exports: [
     //MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
