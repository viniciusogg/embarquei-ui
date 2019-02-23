import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { VeiculoTransporte, TIPO_VEICULO } from './../../../../../modulos/core/model';
import { VeiculoTransporteService } from './../../../../../services/veiculo-transporte.service';
import { StorageDataService } from './../../../../../services/storage-data.service';

@Component({
  selector: 'app-veiculos-listagem',
  templateUrl: './veiculos-listagem.component.html',
  styleUrls: ['./veiculos-listagem.component.css']
})
export class VeiculosListagemComponent implements OnInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceVeiculos: MatTableDataSource<VeiculoTransporte> = new MatTableDataSource();
  displayedColumns = ['placa', 'tipo', 'capacidade', 'cor', 'instituicoes', 'acoes']; // 'status',

  fab = false;

  constructor(private router: Router, private veiculoTransporteService: VeiculoTransporteService,
      private breakPointObserver: BreakpointObserver, private storageDataService: StorageDataService)
  { 
    this.breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) 
      {
        this.displayedColumns = ['placa', 'acoes'];
        this.fab = true;
      }
      else if (result.breakpoints[Breakpoints.Small]) 
      {
        this.displayedColumns = ['placa', 'tipo', 'capacidade', 'acoes'];
        this.fab = false;
      }
      else if (result.breakpoints[Breakpoints.Medium])
      {
        this.displayedColumns = ['placa', 'tipo', 'capacidade', 'cor', 'instituicoes', 'acoes'];
        this.fab = false;      
      }
      else {
        this.displayedColumns = ['placa', 'tipo', 'capacidade', 'cor', 'instituicoes', 'acoes'];
        this.fab = false;
      }
    });
  }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Veículos';
    });

    this.listarMotoristas();
  }

  listarMotoristas() 
  {
    this.veiculoTransporteService.getByCidade()
      .then(response => 
      {
        if (response)
        {
          this.dataSourceVeiculos.data = response;
  
          this.dataSourceVeiculos.sort = this.sort;
        }
      });
  }
  
}
