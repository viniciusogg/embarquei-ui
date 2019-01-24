import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  instituicoesEnsino: Array<InstituicaoEnsino> = new Array<InstituicaoEnsino>();
  motorista: Motorista = null;
  desabilitarCampoBotaoInstituicoes = true;

  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  constructor(private formBuilder: FormBuilder, private breakPointObserver: BreakpointObserver,
      private instituicaoEnsinoService: InstituicaoEnsinoService, private router: Router,
      private errorHandlerService: ErrorHandlerService, private motoristaService: MotoristaService,
      private snackBar: MatSnackBar, private storageDataService: StorageDataService,
      private activatedRoute: ActivatedRoute)
  { 

  }

  ngOnInit() 
  {
    this.storageDataService.tituloBarraSuperior = 'Motoristas';

    this.createForm();

    const idMotorista = this.activatedRoute.snapshot.params['id'];

    if (idMotorista)
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Atualização de motorista';
      });
      this.carregarMotorista(idMotorista);
    }
    else 
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Cadastro de motorista';
      });
    }
    this.buscarInstituicoesEnsino();
  }

  buscarInstituicoesEnsino()
  {
    this.instituicaoEnsinoService.getSemMotoristaAssociado()
      .then(response => {
        if (!(response) || response.length === 0)
        {
          this.desabilitarCampoBotaoInstituicoes = true;
        }
        else if (response)
        {
          this.instituicoesEnsino = response;
          this.desabilitarCampoBotaoInstituicoes = false;
        }
      })
      .catch(erro => this.errorHandlerService.handle(erro));
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

    const instituicaoRemovida: InstituicaoEnsino = instituicoes.splice(instituicoes.indexOf(instituicao), 1)[0];

    this.dataSourceInstituicoes.data = instituicoes;

    if (!this.instituicoesEnsino.filter(instituicao => instituicaoRemovida.id === instituicao.id)[0])
    {
      this.instituicoesEnsino.push(instituicaoRemovida);
    }
    this.desabilitarCampoBotaoInstituicoes = false;
  }

  salvar()
  {
    const motorista = this.criarMotorista(true);

    this.motoristaService.cadastrar(motorista)
      .then(() => {
        this.router.navigate(['/motoristas']);
  
        this.snackBar.open('Conta criada com sucesso', '', { duration: 3500});
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  atualizar()
  {
    const motorista = this.criarMotorista(false);

    this.motoristaService.atualizar(motorista)
      .then(() => {
        this.snackBar.open('Atualizado com sucesso', '', { duration: 3500 });
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  private criarMotorista(novo: boolean): Motorista
  {
    const motorista = new Motorista();

    motorista.nome = this.motoristaForm.get('campoNome').value;
    motorista.sobrenome = this.motoristaForm.get('campoSobrenome').value;
    motorista.numeroCelular = this.motoristaForm.get('campoNumeroCelular').value;
    motorista.instituicoesEnsino = this.dataSourceInstituicoes.data;

    motorista.cidade = new Cidade();
    motorista.cidade.id = this.storageDataService.usuarioLogado.endereco.cidade.id;

    if (novo)
    {
      motorista.foto = new Imagem();
      motorista.foto.caminhoSistemaArquivos = '/';
    }
    else
    {
      motorista.id = this.motorista.id;
    }
    return motorista;
  }

  carregarMotorista(id)
  {
    this.motoristaService.getById(id)
      .then((response) => {
        this.motorista = response;

        this.configurarFormulario(this.motorista);

        this.dataSourceInstituicoes.data = this.motorista.instituicoesEnsino;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
  
  private createForm()
  {
    this.motoristaForm = this.formBuilder.group({
      campoNome: [null, Validators.required],
      campoSobrenome: [null, Validators.required],
      campoNumeroCelular: [null, Validators.required],
      campoInstituicao: [null]
    });
  }

  private configurarFormulario(motorista: Motorista)
  {
    this.motoristaForm.setValue({
      campoNome: motorista.nome,
      campoSobrenome: motorista.sobrenome,
      campoNumeroCelular: motorista.numeroCelular,
      campoInstituicao: null
    });  
  }
}
