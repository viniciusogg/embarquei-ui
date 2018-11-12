import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './../modulos/seguranca/login/login.component'

const routes: Routes = [
  // { path: 'login', component: LoginComponent }
  // { path: 'recuperacao/senha/:token', component: RedefinicaoSenhaComponent, data: {depth: 4}}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SegurancaRoutingModule { }
