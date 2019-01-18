import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { InstituicaoEnsino, TIPO_VEICULO } from './../../../../modulos/core/model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-veiculo-cadastro',
  templateUrl: './veiculo-cadastro.component.html',
  styleUrls: ['./veiculo-cadastro.component.css']
})
export class VeiculoCadastroComponent implements OnInit {

  veiculoForm: FormGroup;

  instituicaoEnsino = '';
  instituicoesEnsino = new Array<any>();
  tiposVeiculo = new Array<any>();
  exibirFabButton = false;
  fotoVeiculo: File;
  tipo = '';

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

    this.instituicoesEnsino.push({nome: 'IFPB'}, {nome: 'UEPB'});
    this.tiposVeiculo.push({valor: TIPO_VEICULO.ONIBUS}, {valor: TIPO_VEICULO.VAN});

    this.dataSourceInstituicoes.data = [{id: '1', nome: 'IFPB'}, {id: '2', nome: 'UEPB'}];
  }

  private createForm()
  {
    this.veiculoForm = this.formBuilder.group({
      campoFoto: [null],
      campoPlaca: [null, Validators.required],
      campoTipo: [null, Validators.required],
      campoCapacidade: [null, Validators.required],
      campoCor: [null, Validators.required],
      campoInstituicao: [null, Validators.required]
    });
  }

  onFotoInput(event)
  {
    this.fotoVeiculo = event.target.files[0];
  }

  removerFotoCarregada()
  {
    this.fotoVeiculo = null;
  }
}
