import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EstudantesPesquisaComponent } from './estudantes-pesquisa/estudantes-pesquisa.component';

const routes: Routes = [
  { path: 'estudantes', component: EstudantesPesquisaComponent }
  // { path: 'recuperacao/senha/:token', component: RedefinicaoSenhaComponent, data: {depth: 4}}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
