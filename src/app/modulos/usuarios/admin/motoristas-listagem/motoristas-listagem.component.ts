import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Motorista } from './../../../../modulos/core/model';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-motoristas-listagem',
  templateUrl: './motoristas-listagem.component.html',
  styleUrls: ['./motoristas-listagem.component.css']
})
export class MotoristasListagemComponent implements OnInit {

  @ViewChild('sort') sort: MatSort;

  dataSourceMotoristas: MatTableDataSource<Motorista> = new MatTableDataSource();
  displayedColumns = ['nome', 'celular', 'instituicoes', 'acoes']; // 'status',

  fab = false;

  constructor(private router: Router, 
      private breakPointObserver: BreakpointObserver)
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
    this.dataSourceMotoristas.data = [
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'},
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },
      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      },      {
        id: '1', 
        nome: 'Teste',
        sobrenome: 'Teste',
        senha: '12345',
        ativo: true,
        numeroCelular: '12345678', 
        instituicoesEnsino: [
          {id: '1', nome: 'IFPB'},
          {id: '1', nome: 'UEPB'}
        ]
      }
    ];
  }

}
