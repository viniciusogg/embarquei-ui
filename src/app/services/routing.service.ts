import { StorageDataService } from './storage-data.service';
import { EstudantesPesquisaComponent } from './../modulos/usuarios/admin/estudantes-pesquisa/estudantes-pesquisa.component';
import { NaoEncontradoComponent } from './../modulos/core/nao-encontrado.component';
import { NaoAutorizadoComponent } from './../modulos/core/nao-autorizado.component';
import { EmAnaliseComponent } from './../modulos/usuarios/estudante/em-analise/em-analise.component';
import { EstudanteCadastroComponent } from './../modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { DashboardComponent } from './../modulos/usuarios/estudante/dashboard/dashboard.component';
import { CheckinComponent } from './../modulos/usuarios/estudante/checkin/checkin.component';
import { AuthGuard } from './../routing/auth.guard';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { EstudanteDetalhesComponent } from '../modulos/usuarios/admin/estudante-detalhes/estudante-detalhes.component';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private storageDataService: StorageDataService) {}

  configurarRotas(tipoUsuarioLogado)
  {
    const rotaLogin = this.router.config.filter(rota => rota.path === 'login');

    let isUsuarioAtivo = localStorage.getItem('isUsuarioAtivo');

    if(isUsuarioAtivo === 'false')
    {
      console.log('CONFIGURANDO ROTA EM ANALISE');
      this.router.resetConfig(this.rotaEmAnalise);
    }
    else if(tipoUsuarioLogado === 'est')
    {
      console.log('CONFIGURANDO ROTAS ESTUDANTES');
      this.router.resetConfig(this.rotasEstudante);
    }
    else if(tipoUsuarioLogado === 'admin')
    {
      this.router.resetConfig(this.rotasAdmin);
    }

    this.router.config.push(rotaLogin[0]);

    for(let rota of this.rotasPadrao)
    {
      this.router.config.push(rota);
    }

  }

  rotasEstudante = [
    // {
    //   path: '/inicio',
    //   component:
    //   pathMatch: 'full'
    //   redirectTo: '/',
    //   canActivate: [AuthGuard],
    //   data: { tiposUsuariosPermitidos: ['est'] }
    // },
    {
      path: 'resumoDiario',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },
    {
      path: 'checkin',
      component: CheckinComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },
    {
      path: 'emAnalise',
      component: EmAnaliseComponent
    }
  ];

  rotasPadrao = [
    // { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'acesso-negado', component: NaoAutorizadoComponent},
    { path: 'pagina-nao-encontrada', component: NaoEncontradoComponent},
    {
      path: 'cadastro/estudante',
      component: EstudanteCadastroComponent
    },
    { path: '**', redirectTo: 'pagina-nao-encontrada' }
  ];

  rotasAdmin = [
    {
      path: 'estudantes',
      component: EstudantesPesquisaComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
     },
     {
       path: 'estudantes/:id',
       component: EstudanteDetalhesComponent,
       canActivate: [AuthGuard],
       data: { tiposUsuariosPermitidos: ['admin'] }
     }
  ];

  rotaEmAnalise = [
    {
      path: 'emAnalise', component: EmAnaliseComponent,
      data: { tiposUsuariosPermitidos: ['est'] }
    }
  ]

}

