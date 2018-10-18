import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EstudantesPesquisaComponent } from './estudantes-pesquisa/estudantes-pesquisa.component';
import { AuthGuard } from './../../seguranca/auth.guard';

const routes: Routes = [
  {
    path: 'estudantes',
    component: EstudantesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { tiposUsuariosPermitidos: ['admin', 'est'] }
   }
  // { path: 'recuperacao/senha/:token', component: RedefinicaoSenhaComponent, data: {depth: 4}}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
