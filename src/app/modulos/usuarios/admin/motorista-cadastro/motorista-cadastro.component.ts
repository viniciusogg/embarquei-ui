import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatSnackBar } from '@angular/material';

import { InstituicaoEnsino, Motorista, Cidade, Imagem } from './../../../../modulos/core/model';
import { InstituicaoEnsinoService } from './../../../../services/instituicao-ensino.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { MotoristaService } from './../../../../services/motorista.service';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-motorista-cadastro',
  templateUrl: './motorista-cadastro.component.html',
  styleUrls: ['./motorista-cadastro.component.css']
})
export class MotoristaCadastroComponent implements OnInit {

  motoristaForm: FormGroup;
  instituicaoEnsino: InstituicaoEnsino;
  instituicoesEnsino = new Array<any>();
  exibirFabButton = false;

  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  constructor(private formBuilder: FormBuilder, private breakPointObserver: BreakpointObserver,
      private instituicaoEnsinoService: InstituicaoEnsinoService, private router: Router,
      private errorHandlerService: ErrorHandlerService, private motoristaService: MotoristaService,
      private snackBar: MatSnackBar, private storageDataService: StorageDataService)
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

    this.buscarInstituicoesEnsino();
  }

  buscarInstituicoesEnsino()
  {
    this.instituicaoEnsinoService.getAll()
      .then(response => {
        this.instituicoesEnsino = response.instituicoes;
      });
  }

  adicionarInstituicao()
  {
    const instituicaoEnsino: InstituicaoEnsino = this.motoristaForm.get('campoInstituicao').value;
    
    if (instituicaoEnsino)
    {
      const instituicoes: InstituicaoEnsino[] = this.dataSourceInstituicoes.data;
  
      const instituicaoEncontradaTabela = instituicoes.filter(instituicao =>
          instituicao.id === instituicaoEnsino.id)[0];
  
      if (!instituicaoEncontradaTabela)
      {
        instituicoes.push(this.motoristaForm.get('campoInstituicao').value);
    
        this.dataSourceInstituicoes.data = instituicoes;  
      }
    }
  }

  removerInstituicao(instituicao: InstituicaoEnsino) 
  {
    const instituicoes: InstituicaoEnsino[] = this.dataSourceInstituicoes.data;

    instituicoes.splice(instituicoes.indexOf(instituicao), 1);

    this.dataSourceInstituicoes.data = instituicoes;
  }

  salvar()
  {
    const motorista = this.criarMotorista();

    this.motoristaService.cadastrar(motorista)
      .then(() => {
        this.router.navigate(['/motoristas']);
  
        this.snackBar.open('Conta criada com sucesso', '', { duration: 3500});
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  private criarMotorista(): Motorista
  {
    const motorista = new Motorista();

    motorista.nome = this.motoristaForm.get('campoNome').value;
    motorista.sobrenome = this.motoristaForm.get('campoSobrenome').value;
    motorista.numeroCelular = this.motoristaForm.get('campoNumeroCelular').value;
    motorista.instituicoesEnsino = this.dataSourceInstituicoes.data;

    motorista.cidade = new Cidade();
    motorista.cidade.id = this.storageDataService.usuarioLogado.endereco.cidade.id;

    motorista.foto = new Imagem();
    motorista.foto.caminhoSistemaArquivos = '/';

    return motorista;
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
