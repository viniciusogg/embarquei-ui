import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthGuard } from './../routing/auth.guard';
import { StorageDataService } from './storage-data.service';
import { NaoEncontradoComponent } from './../modulos/core/nao-encontrado.component';
import { NaoAutorizadoComponent } from './../modulos/core/nao-autorizado.component';
import { EmAnaliseComponent } from './../modulos/usuarios/estudante/em-analise/em-analise.component';

import { DashboardComponent } from './../modulos/usuarios/estudante/dashboard/dashboard.component';
import { CheckinComponent } from './../modulos/usuarios/estudante/checkin/checkin.component';
import { EstudanteCadastroComponent } from './../modulos/usuarios/estudante/estudante-cadastro/estudante-cadastro.component';
import { EstudantesListagemComponent } from './../modulos/usuarios/admin/estudante/estudantes-listagem/estudantes-listagem.component';
import { EstudanteDetalhesComponent } from '../modulos/usuarios/admin/estudante/estudante-detalhes/estudante-detalhes.component';
import { MotoristaCadastroComponent } from '../modulos/usuarios/admin/motorista/motorista-cadastro/motorista-cadastro.component';
import { MotoristasListagemComponent } from '../modulos/usuarios/admin/motorista/motoristas-listagem/motoristas-listagem.component';
import { VeiculoCadastroComponent } from '../modulos/usuarios/admin/veiculo/veiculo-cadastro/veiculo-cadastro.component';
import { VeiculosListagemComponent } from '../modulos/usuarios/admin/veiculo/veiculos-listagem/veiculos-listagem.component';
import { PainelControleComponent } from '../modulos/usuarios/motorista/painel-controle/painel-controle.component';
import { FeedbackComponent } from '../modulos/usuarios/comum/feedback/feedback.component';
import { ListagemNotificacoesComponent } from '../modulos/usuarios/estudante/listagem-notificacoes/listagem-notificacoes.component';
import { RenovacaoCadastroComponent } from '../modulos/usuarios/estudante/renovacao-cadastro/renovacao-cadastro.component';
import { ListagemSosComponent } from '../modulos/usuarios/estudante/listagem-sos/listagem-sos.component';
import { DetalhesVeiculoComponent } from '../modulos/usuarios/estudante/detalhes-veiculo/detalhes-veiculo.component';
import { RotaCadastroComponent } from '../modulos/usuarios/admin/rota/rota-cadastro/rota-cadastro.component';
import { RotasListagemComponent } from '../modulos/usuarios/admin/rota/rotas-listagem/rotas-listagem.component';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router, private storageDataService: StorageDataService) {}

  configurarRotas(tipoUsuarioLogado)
  {
    const rotaLogin = this.router.config.filter(rota => rota.path === 'login');

    let isUsuarioAtivo = localStorage.getItem('isUsuarioAtivo');

    if (isUsuarioAtivo === 'false')
    {
      // console.log('CONFIGURANDO ROTA EM ANALISE');
      this.router.resetConfig(this.rotaEmAnalise);
    }
    else if (tipoUsuarioLogado === 'est')
    {
      // console.log('CONFIGURANDO ROTAS ESTUDANTES');
      this.router.resetConfig(this.rotasEstudante);
    }
    else if (tipoUsuarioLogado === 'admin')
    {
      this.router.resetConfig(this.rotasAdmin);
    }
    else if (tipoUsuarioLogado === 'mot')
    {
      this.router.resetConfig(this.rotasMotorista);
    }
    this.router.config.push(rotaLogin[0]);

    for (let rota of this.rotasPadrao)
    {
      this.router.config.push(rota);
    }

  }

  rotasEstudante = [
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
      path: 'notificacoes',
      component: ListagemNotificacoesComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },
    {
      path: 'renovacaoCadastro',
      component: RenovacaoCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },
    {
      path: 'sos',
      component: ListagemSosComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },
    {
      path: 'detalhesVeiculo/:id',
      component: DetalhesVeiculoComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['est'] }
    },

    // {
    //   path: 'emAnalise',
    //   component: EmAnaliseComponent
    // }
  ];

  rotasPadrao = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'acesso-negado', component: NaoAutorizadoComponent},
    { path: 'pagina-nao-encontrada', component: NaoEncontradoComponent},
    {
      path: 'estudante/cadastro',
      component: EstudanteCadastroComponent
    },
    { 
      path: 'feedback', 
      component: FeedbackComponent,
      canActivate: [AuthGuard],
      data: {tiposUsuariosPermitidos: ['admin', 'mot', 'est']}
    },
    { path: '**', redirectTo: 'pagina-nao-encontrada' }
  ];

  rotasAdmin = [
    // {
    //   path: 'inicio',
    //   component: 
    // },
    {
      path: 'estudantes',
      component: EstudantesListagemComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'estudantes/:id',
      component: EstudanteDetalhesComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'motoristas/cadastro',
      component: MotoristaCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'motoristas',
      component: MotoristasListagemComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'motoristas/:id',
      component: MotoristaCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'veiculo/cadastro',
      component: VeiculoCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'veiculos',
      component: VeiculosListagemComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'veiculos/:id',
      component: VeiculoCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'rota/cadastro',
      component: RotaCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'rotas',
      component: RotasListagemComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    },
    {
      path: 'rotas/:id',
      component: RotaCadastroComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['admin'] }
    }
  ];

  rotasMotorista = [
    {
      path: 'painelControle',
      component: PainelControleComponent,
      canActivate: [AuthGuard],
      data: { tiposUsuariosPermitidos: ['mot'] }
    }
  ];

  rotaEmAnalise = [
    {
      path: 'emAnalise', component: EmAnaliseComponent,
      data: { tiposUsuariosPermitidos: ['est'] }
    }
  ];

}

