import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatChipsModule } from '@angular/material/chips';

import { EstudantesListagemComponent } from './estudante/estudantes-listagem/estudantes-listagem.component';
import { EstudanteDetalhesComponent } from './estudante/estudante-detalhes/estudante-detalhes.component';
import { MotoristaCadastroComponent } from './motorista/motorista-cadastro/motorista-cadastro.component';
import { MotoristasListagemComponent } from './motorista/motoristas-listagem/motoristas-listagem.component';
import { VeiculosListagemComponent } from './veiculo/veiculos-listagem/veiculos-listagem.component';
import { VeiculoCadastroComponent } from './veiculo/veiculo-cadastro/veiculo-cadastro.component';
import { RotaCadastroComponent, MapaDialogComponent } from './rota/rota-cadastro/rota-cadastro.component';

import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatGridListModule,
    TextFieldModule,
    MatChipsModule,

    TextMaskModule,
    AgmCoreModule,
    AgmDirectionModule
  ],
  declarations: [
    EstudantesListagemComponent, 
    EstudanteDetalhesComponent, 
    MotoristaCadastroComponent, 
    MotoristasListagemComponent, 
    VeiculosListagemComponent, 
    VeiculoCadastroComponent, 
    RotaCadastroComponent,
    MapaDialogComponent
  ],
  providers:[],
  entryComponents: [
    MapaDialogComponent
  ], // DIALOGS AQUI
})
export class AdminModule { }
