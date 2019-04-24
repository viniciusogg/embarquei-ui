import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Rota } from './../../../../core/model';
import { RotaService } from './../../../../../services/rota.service';
import { StorageDataService } from './../../../../../services/storage-data.service';

@Component({
  selector: 'app-rotas-listagem',
  templateUrl: './rotas-listagem.component.html',
  styleUrls: ['./rotas-listagem.component.css']
})
export class RotasListagemComponent implements OnInit 
{
  @ViewChild('sort') sort: MatSort;

  dataSourceRotas: MatTableDataSource<Rota> = new MatTableDataSource();
  displayedColumns = ['instituicoes', 'cidadeDestino', 'acoes']; // 'status',

  fab = false;

  constructor(private router: Router, private rotaService: RotaService,
      private breakPointObserver: BreakpointObserver, private storageDataService: StorageDataService)
  { 
    this.breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) 
      {
        this.displayedColumns = ['instituicoes', 'acoes'];
        this.fab = true;
      }
      else 
      {
        this.displayedColumns = ['instituicoes', 'cidadeDestino', 'acoes'];
        this.fab = false;
      }
    });
  }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Rotas';
    });
    this.listarRotas();
  }

  listarRotas() 
  {
    this.rotaService.buscarRotasPorCidade()
      .then(response => 
      {
        if (response)
        {
          this.dataSourceRotas.data = response;
  
          this.dataSourceRotas.sort = this.sort;
        }
      });
  }
}
