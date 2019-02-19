import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListagemVeiculosComponent } from './listagem-veiculos/listagem-veiculos.component';
import { DetalhesVeiculoComponent } from './detalhes-veiculo/detalhes-veiculo.component';
import { VeiculoTransporteRoutingModule } from './../../routing/veiculo-transporte-routing.module';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [ListagemVeiculosComponent, DetalhesVeiculoComponent],
  imports: [
    CommonModule,
    RouterModule,
    VeiculoTransporteRoutingModule,
    MatCardModule,
  ]
})
export class VeiculoTransporteModule { }
