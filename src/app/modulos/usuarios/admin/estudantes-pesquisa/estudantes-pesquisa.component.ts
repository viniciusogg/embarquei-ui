import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from './../../../../services/admin.service';
import { Estudante } from './../../../core/model';

@Component({
  selector: 'app-estudantes-pesquisa',
  templateUrl: './estudantes-pesquisa.component.html',
  styleUrls: ['./estudantes-pesquisa.component.css']
})
export class EstudantesPesquisaComponent implements OnInit, AfterViewInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceEstudantes: MatTableDataSource<Estudante> = new MatTableDataSource();
  displayedColumns = ['nome', 'celular', 'curso', 'status', 'acoes']; // 'status',

  constructor(private adminService: AdminService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listarEstudantes();
    console.log('Iniciou tela de estudantes cadastrados');
  }

  listarEstudantes() {
    this.adminService.listarEstudantes()
      .then(resultado => {

        this.dataSourceEstudantes.data = resultado.estudantes;

        this.dataSourceEstudantes.sort = this.sort;
      });
  }

  atualizarEstudante()
  {

  }

  abrirDialog(estudante)
  {
    this.dialog.open(ConfirmacaoCadastroDialogComponent, {
      height: '90%', width: '99%',
      data: {
        estudante: estudante
      }
    });
  }
}


@Component({
  selector: 'app-confirmacao-cadastro-dialog',
  templateUrl: './dialogs/confirmacao-cadastro-dialog.component.html',
  styleUrls: ['./estudantes-pesquisa.component.css']
})
export class ConfirmacaoCadastroDialogComponent implements OnInit{

  estudante: Estudante;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.estudante = data.estudante;
  }

  ngOnInit(){}



}
