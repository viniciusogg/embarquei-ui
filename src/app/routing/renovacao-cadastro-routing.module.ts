import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';
import { RenovacaoCadastroComponent } from '../modulos/renovacao-cadastro/renovacao-cadastro/renovacao-cadastro.component';

const routes: Routes = [
  {
    path: 'renovacaoCadastro',
    component: RenovacaoCadastroComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RenovacaoCadastroRoutingModule { }
