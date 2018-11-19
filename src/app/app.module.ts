import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { environment } from '../environments/environment';

import { CoreModule } from './modulos/core/core.module';
import { LayoutModule } from './modulos/layout/layout.module';
import { SegurancaModule } from './modulos/seguranca/seguranca.module';
import { EstudanteModule } from './modulos/usuarios/estudante/estudante.module';
import { AdminModule } from './modulos/usuarios/admin/admin.module';

import { EstudantesPesquisaComponent } from './modulos/usuarios/admin/estudantes-pesquisa/estudantes-pesquisa.component';
import { EmAnaliseComponent } from './modulos/usuarios/estudante/em-analise/em-analise.component';
import { CheckinComponent } from './modulos/usuarios/estudante/checkin/checkin.component';
import { EstudanteCadastroComponent } from './modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { DashboardComponent } from './modulos/usuarios/estudante/dashboard/dashboard.component';
import { EstudanteDetalhesComponent } from './modulos/usuarios/admin/estudante-detalhes/estudante-detalhes.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpModule,
    HttpClientModule,

    AngularFireModule.initializeApp(environment.firebase),

    LayoutModule,
    SegurancaModule,
    EstudanteModule,
    AdminModule
  ],
  exports: [
     //MatSnackBarModule
  ],
  entryComponents: [
    DashboardComponent,
    EstudanteCadastroComponent,
    CheckinComponent,
    EmAnaliseComponent,

    EstudantesPesquisaComponent,
    EstudanteDetalhesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
