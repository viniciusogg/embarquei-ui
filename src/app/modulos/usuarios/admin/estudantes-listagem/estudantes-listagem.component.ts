import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AdminService } from '../../../../services/admin.service';
import { Estudante } from '../../../core/model';

@Component({
  selector: 'app-estudantes-listagem',
  templateUrl: './estudantes-listagem.component.html',
  styleUrls: ['./estudantes-listagem.component.css']
})
export class EstudantesListagemComponent implements OnInit, AfterViewInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceEstudantes: MatTableDataSource<Estudante> = new MatTableDataSource();
  displayedColumns = ['nome', 'celular', 'curso', 'status', 'acoes']; // 'status',

  constructor(private adminService: AdminService, private router: Router, 
      private breakPointObserver: BreakpointObserver)
  { 
    this.breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.displayedColumns = ['nome', 'acoes'];
      }
      else if (result.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['nome', 'status', 'acoes'];
      }
      else {
        this.displayedColumns = ['nome', 'celular', 'curso', 'status', 'acoes'];
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() 
  {
    this.listarEstudantes();
  }

  listarEstudantes() 
  {
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
