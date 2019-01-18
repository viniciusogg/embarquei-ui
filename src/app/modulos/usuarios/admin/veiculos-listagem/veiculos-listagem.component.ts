import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { VeiculoTransporte, TIPO_VEICULO } from './../../../../modulos/core/model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

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

  constructor(private router: Router, 
      private breakPointObserver: BreakpointObserver)
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
    this.dataSourceVeiculos.data = [
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      },
      {
        id: '1', 
        placa: 'ACB-123',
        capacidade: 35,
        cor: 'Branco',
        tipo: TIPO_VEICULO.ONIBUS,
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'}
        ]
      }
    ];
  }

}
