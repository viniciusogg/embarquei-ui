import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
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

  constructor(private adminService: AdminService, private router: Router)
  { }

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

  abrirDetalhes(estudante: Estudante)
  {
    this.router.navigate(['/estudantes', estudante.id]);
  }
}
