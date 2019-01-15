import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './modulos/core/core.module';
import { LayoutModule } from './modulos/layout/layout.module';
import { SegurancaModule } from './modulos/seguranca/seguranca.module';
import { EstudanteModule } from './modulos/usuarios/estudante/estudante.module';
import { AdminModule } from './modulos/usuarios/admin/admin.module';
import { NotificacaoModule } from './modulos/notificacao/notificacao.module';
import { RenovacaoCadastroModule } from './modulos/renovacao-cadastro/renovacao-cadastro.module';
import { SosModule } from './modulos/sos/sos.module';
import { VeiculoTransporteModule } from './modulos/veiculo-transporte/veiculo-transporte.module';


@NgModule({
  declarations: [
    AppComponent
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
    NotificacaoModule,
    RenovacaoCadastroModule,
    SosModule,
    VeiculoTransporteModule
  ],
  exports: [
     //MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
