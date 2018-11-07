import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EstudanteRoutingModule } from '../../../routing/estudante-routing.module';

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

import { DashboardComponent } from './dashboard/dashboard.component';
import { EstudanteCadastroComponent } from './estudante-cadastro/estudante-cadastro.component';
import { CheckinComponent, AjudaDialogComponent, LembreteDialogComponent } from './checkin/checkin.component';
import { EmAnaliseComponent } from './em-analise/em-analise.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    EstudanteRoutingModule,
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
    MatDialogModule
  ],
  declarations: [
    DashboardComponent,
    EstudanteCadastroComponent,
    CheckinComponent,
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
