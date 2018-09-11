import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConteudoComponent } from './conteudo/conteudo.component';

import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [ConteudoComponent],
  exports: [
    ConteudoComponent
  ],
})
export class ConteudoModule { }
