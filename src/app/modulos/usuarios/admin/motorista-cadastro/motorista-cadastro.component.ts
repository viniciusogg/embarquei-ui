import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { InstituicaoEnsino } from './../../../../modulos/core/model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-motorista-cadastro',
  templateUrl: './motorista-cadastro.component.html',
  styleUrls: ['./motorista-cadastro.component.css']
})
export class MotoristaCadastroComponent implements OnInit {

  motoristaForm: FormGroup;

  instituicaoEnsino = '';

  instituicoesEnsino = new Array<any>();

  exibirFabButton = false;

  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  constructor(private formBuilder: FormBuilder, private breakPointObserver: BreakpointObserver)
  { 
    this.breakPointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) 
      {
        this.exibirFabButton = true;
      }
      else if (result.breakpoints[Breakpoints.Small]) {
        this.exibirFabButton = false;
      }
      else {
        this.exibirFabButton = false;
      }
    });
  }

  ngOnInit() 
  {
    this.createForm();

    this.instituicoesEnsino.push({nome: 'IFPB'}, {nome: 'UEPB'})

    this.dataSourceInstituicoes.data = [{id: '1', nome: 'IFPB'}, {id: '2', nome: 'UEPB'}];
  }

  private createForm()
  {
    this.motoristaForm = this.formBuilder.group({
      campoNome: [null, Validators.required],
      campoSobrenome: [null, Validators.required],
      campoNumeroCelular: [null, Validators.required],
      campoInstituicao: [null, Validators.required]
    });
  }
  
}
