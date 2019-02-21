import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudanteCadastroComponent } from './estudante-cadastro/estudante-cadastro.component';
import { CheckinComponent, AjudaDialogComponent, LembreteDialogComponent } from './checkin/checkin.component';
import { EmAnaliseComponent } from './em-analise/em-analise.component';
import { DetalhesVeiculoComponent } from './detalhes-veiculo/detalhes-veiculo.component';
import { ListagemNotificacoesComponent } from './listagem-notificacoes/listagem-notificacoes.component';
import { ListagemSosComponent } from './listagem-sos/listagem-sos.component';
import { RenovacaoCadastroComponent } from './renovacao-cadastro/renovacao-cadastro.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ReactiveFormsModule,
    FormsModule,

    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
  ],
  declarations: [
    DashboardComponent,
    EstudanteCadastroComponent,
    CheckinComponent,
    DetalhesVeiculoComponent,
    ListagemNotificacoesComponent,
    ListagemSosComponent,
    RenovacaoCadastroComponent,
    AjudaDialogComponent,
    LembreteDialogComponent,
    EmAnaliseComponent
  ],
  entryComponents: [
    AjudaDialogComponent,
    LembreteDialogComponent
  ],
})
export class EstudanteModule { }
