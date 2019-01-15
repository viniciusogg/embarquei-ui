import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenovacaoCadastroComponent } from './renovacao-cadastro/renovacao-cadastro.component';
import { RouterModule } from '@angular/router';
import { RenovacaoCadastroRoutingModule } from './../../routing/renovacao-cadastro-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RenovacaoCadastroRoutingModule
  ],
  declarations: [RenovacaoCadastroComponent]
})
export class RenovacaoCadastroModule { }
