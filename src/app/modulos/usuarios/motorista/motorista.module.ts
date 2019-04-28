import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelControleComponent } from './painel-controle/painel-controle.component';
import { ListaPresencaComponent } from './lista-presenca/lista-presenca.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../comum/share.module';
import { MatStepperModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatBottomSheetModule, MatCheckboxModule, MatDialogModule, MatListModule, MatDividerModule, MatChipsModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ReactiveFormsModule,
    FormsModule,

    ShareModule,

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
    MatChipsModule,
    AgmCoreModule,
    AgmDirectionModule
  ],
  declarations: [PainelControleComponent, ListaPresencaComponent]
})
export class MotoristaModule { }
