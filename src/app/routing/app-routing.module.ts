import { EstudantesPesquisaComponent } from '../modulos/usuarios/admin/estudantes-pesquisa/estudantes-pesquisa.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from '../modulos/usuarios/estudante/dashboard/dashboard.component';
import { EstudanteCadastroComponent } from '../modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { EmAnaliseComponent } from '../modulos/usuarios/estudante/em-analise/em-analise.component';
import { LoginComponent } from '../modulos/seguranca/login/login.component';
import { NaoEncontradoComponent } from '../modulos/core/nao-encontrado.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaoAutorizadoComponent } from '../modulos/core/nao-autorizado.component';
/*import { PaginaNaoEncontradaComponent } from './modulos/core/pagina-nao-encontrada.component';*/

const routes: Routes = [

  // SEGURANÇA
  { path: 'login', component: LoginComponent },

  // ESTUDANTE
  // {
  //   path: 'resumoDiario',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  //   data: { tiposUsuariosPermitidos: ['est'] }
  // },
  // {
  //   path: 'cadastro/estudante',
  //   component: EstudanteCadastroComponent
  // },
  // {
  //   path: 'checkin',
  //   component: CheckinComponent,
  //   canActivate: [AuthGuard],
  //   data: { tiposUsuariosPermitidos: ['est'] }
  // },
  // {
  //   path: 'emAnalise',
  //   component: EmAnaliseComponent
  // },

  // ADMIN
  // {
  //   path: 'estudantes',
  //   component: EstudantesPesquisaComponent,
  //   canActivate: [AuthGuard],
  //   data: { tiposUsuariosPermitidos: ['admin'] }
  //  },

  //CORINGA
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'acesso-negado', component: NaoAutorizadoComponent },
  { path: 'pagina-nao-encontrada', component: NaoEncontradoComponent},
  // { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
