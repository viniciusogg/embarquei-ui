import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';
import { DetalhesVeiculoComponent } from '../modulos/veiculo-transporte/detalhes-veiculo/detalhes-veiculo.component';
import { ListagemVeiculosComponent } from '../modulos/veiculo-transporte/listagem-veiculos/listagem-veiculos.component';

const routes: Routes = [
  {
    path: 'detalhesVeiculo',
    component: DetalhesVeiculoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'veiculos',
    component: ListagemVeiculosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeiculoTransporteRoutingModule { }
