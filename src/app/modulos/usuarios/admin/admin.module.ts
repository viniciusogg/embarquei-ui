import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';


import { EstudantesPesquisaComponent } from './estudantes-pesquisa/estudantes-pesquisa.component';
import { AdminRoutingModule } from '../../../routing/admin-routing.module';
import { EstudanteDetalhesComponent } from './estudante-detalhes/estudante-detalhes.component';

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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AdminRoutingModule,

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
    TextFieldModule
  ],
  declarations: [EstudantesPesquisaComponent, EstudanteDetalhesComponent],
  providers:[],
  entryComponents: [] // DIALOGS AQUI
})
export class AdminModule { }
