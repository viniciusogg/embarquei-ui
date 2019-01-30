import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent, InstalacaoAppDialogComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { environment } from '../environments/environment';

import { CoreModule } from './modulos/core/core.module';
import { LayoutModule } from './modulos/layout/layout.module';
import { SegurancaModule } from './modulos/seguranca/seguranca.module';
import { EstudanteModule } from './modulos/usuarios/estudante/estudante.module';
import { AdminModule } from './modulos/usuarios/admin/admin.module';

import { EstudantesListagemComponent } from './modulos/usuarios/admin/estudantes-listagem/estudantes-listagem.component';
import { EmAnaliseComponent } from './modulos/usuarios/estudante/em-analise/em-analise.component';
import { CheckinComponent } from './modulos/usuarios/estudante/checkin/checkin.component';
import { EstudanteCadastroComponent } from './modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { DashboardComponent } from './modulos/usuarios/estudante/dashboard/dashboard.component';
import { EstudanteDetalhesComponent } from './modulos/usuarios/admin/estudante-detalhes/estudante-detalhes.component';
import { MotoristaCadastroComponent } from './modulos/usuarios/admin/motorista-cadastro/motorista-cadastro.component';
import { MotoristasListagemComponent } from './modulos/usuarios/admin/motoristas-listagem/motoristas-listagem.component';
import { VeiculoCadastroComponent } from './modulos/usuarios/admin/veiculo-cadastro/veiculo-cadastro.component';
import { VeiculosListagemComponent } from './modulos/usuarios/admin/veiculos-listagem/veiculos-listagem.component';

@NgModule({
  declarations: [
    AppComponent,
    InstalacaoAppDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpModule,
    HttpClientModule,

    LayoutModule,
    SegurancaModule,
    EstudanteModule,
    AdminModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatDialogModule
  ],
  entryComponents: [
    InstalacaoAppDialogComponent,

    // estudante
    DashboardComponent,
    EstudanteCadastroComponent,
    CheckinComponent,
    EmAnaliseComponent,

    // admin
    EstudantesListagemComponent,
    EstudanteDetalhesComponent,
    MotoristaCadastroComponent, 
    MotoristasListagemComponent,
    VeiculoCadastroComponent,
    VeiculosListagemComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
