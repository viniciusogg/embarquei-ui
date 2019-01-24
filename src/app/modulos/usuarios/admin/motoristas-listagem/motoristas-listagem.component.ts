import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Motorista } from './../../../../modulos/core/model';
import { MotoristaService } from './../../../../services/motorista.service';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-motoristas-listagem',
  templateUrl: './motoristas-listagem.component.html',
  styleUrls: ['./motoristas-listagem.component.css']
})
export class MotoristasListagemComponent implements OnInit, AfterViewInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceMotoristas: MatTableDataSource<Motorista> = new MatTableDataSource();
  displayedColumns = ['nome', 'celular', 'instituicoes', 'acoes']; // 'status',

  fab = false;

  constructor(private router: Router, private motoristaService: MotoristaService,
      private breakPointObserver: BreakpointObserver, private storageDataService: StorageDataService)
  { 
    this.breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.displayedColumns = ['nome', 'acoes'];
        this.fab = true;
      }
      else if (result.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['nome', 'celular', 'acoes'];
        this.fab = false;
      }
      else {
        this.displayedColumns = ['nome', 'celular', 'instituicoes', 'acoes'];
        this.fab = false;
      }
    });
  }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Motoristas';
    });
  }

  ngAfterViewInit()
  {
    this.listarMotoristas();
  }

  listarMotoristas() 
  {
    this.motoristaService.getByCidade()
      .then(response => {
        if (response)
        {
          this.dataSourceMotoristas.data = response;
  
          this.dataSourceMotoristas.sort = this.sort;
        }
      });
  }
}
