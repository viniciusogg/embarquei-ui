import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*import { NaoAutorizadoComponent } from './modulos/core/nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './modulos/core/pagina-nao-encontrada.component';*/

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
/*  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },*/
  { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
