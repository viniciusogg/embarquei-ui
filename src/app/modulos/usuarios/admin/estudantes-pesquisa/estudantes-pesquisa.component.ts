import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AdminService } from './../admin.service';
import { Usuario } from './../../../core/model';

@Component({
  selector: 'app-estudantes-pesquisa',
  templateUrl: './estudantes-pesquisa.component.html',
  styleUrls: ['./estudantes-pesquisa.component.css']
})
export class EstudantesPesquisaComponent implements OnInit, AfterViewInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceEstudantes: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns = ['nome', 'celular', 'instituicaoEnsino', 'status', 'acoes']; // 'status',

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listarEstudantes();
  }

  listarEstudantes() {
    this.adminService.listarEstudantes()
      .then(resultado => {

        this.dataSourceEstudantes.data = resultado.estudantes;

        this.dataSourceEstudantes.sort = this.sort;
      });
  }

}
