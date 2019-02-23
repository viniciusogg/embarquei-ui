import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSnackBar } from '@angular/material';

import { InstituicaoEnsino, TIPO_VEICULO, COLECAO_ARQUIVO, VeiculoTransporte, Imagem } from './../../../../core/model';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { VeiculoTransporteService } from './../../../../../services/veiculo-transporte.service';
import { UploadService } from './../../../../../services/upload.service';
import { ErrorHandlerService } from './../../../../core/error-handler.service';
import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';

import { v4 as uuid } from 'uuid';

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
  fotoVeiculo: File;
  tipo = '';
  veiculo: VeiculoTransporte = null;
  desabilitarCampoBotaoInstituicoes = true;

  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
      private storageDataService: StorageDataService, private veiculoService: VeiculoTransporteService,
      private errorHandlerService: ErrorHandlerService, private uploadService: UploadService,
      private router: Router, private snackBar: MatSnackBar, private instituicaoEnsinoService: InstituicaoEnsinoService) 
  {}

  ngOnInit() 
  {
    // this.createForm();

    // this.instituicoesEnsino.push({nome: 'IFPB'}, {nome: 'UEPB'});
    this.tiposVeiculo.push({valor: TIPO_VEICULO.ONIBUS}, {valor: TIPO_VEICULO.VAN});

    // this.dataSourceInstituicoes.data = [{id: '1', nome: 'IFPB'}, {id: '2', nome: 'UEPB'}];
    this.createForm();

    const idVeiculo = this.activatedRoute.snapshot.params['id'];

    if (idVeiculo)
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Atualização de veículo';
      });
      this.carregarVeiculo(idVeiculo);
    }
    else 
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Cadastro de veículo';
      });
    }
    this.buscarInstituicoesEnsino();
  }

  salvar()
  {
    const idVeiculo = this.activatedRoute.snapshot.params['id'];

    let veiculo = null;

    if (idVeiculo)
    {
      veiculo = this.criarVeiculo(false);
    }
    else
    {
      veiculo = this.criarVeiculo(true);
    }
    this.veiculoService.cadastrar(veiculo)
      .then(() => {
        if (this.fotoVeiculo)
        {
          this.salvarFoto();
        }
        this.router.navigate(['/veiculos']);
  
        this.snackBar.open('Veículo cadastrado com sucesso', '', { duration: 3500});
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  atualizar()
  {
    const veiculo = this.criarVeiculo(false);

    this.veiculoService.atualizar(veiculo)
      .then(() => {
        if (this.fotoVeiculo)
        {
          this.salvarFoto();
        }
        this.snackBar.open('Atualizado com sucesso', '', { duration: 3500 });
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);
      });
  }

  private createForm()
  {
    this.veiculoForm = this.formBuilder.group({
      campoFoto: [null],
      campoPlaca: [null, Validators.required],
      campoTipo: [null, Validators.required],
      campoCapacidade: [null, Validators.required],
      campoCor: [null],
      campoInstituicao: [null]
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

  carregarVeiculo(idVeiculo)
  {
    this.veiculoService.getById(idVeiculo)
      .then((response) => {
        this.veiculo = response;

        this.configurarFormulario(this.veiculo);

        this.dataSourceInstituicoes.data = this.veiculo.instituicoesEnsino;
        
        this.uploadService.getFile(this.veiculo.imagem.caminhoSistemaArquivos)
          .toPromise()
          .then((response) => {
            this.veiculo.linkFoto = response;
          });
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  buscarInstituicoesEnsino()
  {
    this.instituicaoEnsinoService.getSemVeiculoAssociado()
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
    const instituicaoEnsino: InstituicaoEnsino = this.veiculoForm.get('campoInstituicao').value;
    
    if (instituicaoEnsino)
    {
      const instituicoes: InstituicaoEnsino[] = this.dataSourceInstituicoes.data;
  
      const instituicaoEncontradaTabela = instituicoes.filter(instituicao =>
          instituicao.id === instituicaoEnsino.id)[0];
  
      if (!instituicaoEncontradaTabela)
      {
        instituicoes.push(this.veiculoForm.get('campoInstituicao').value);
    
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

  private criarVeiculo(novo: boolean): VeiculoTransporte
  {
    const veiculo = new VeiculoTransporte();

    veiculo.placa = this.veiculoForm.get('campoPlaca').value;
    veiculo.capacidade = this.veiculoForm.get('campoCapacidade').value;
    veiculo.tipo = this.veiculoForm.get('campoTipo').value;
    veiculo.cor = this.veiculoForm.get('campoCor').value;
    veiculo.instituicoesEnsino = this.dataSourceInstituicoes.data;
    veiculo.cidade = this.storageDataService.usuarioLogado.endereco.cidade;

    if (novo)
    {
      veiculo.imagem = this.criarFoto(true);
    }
    else if (!novo)
    {
      veiculo.id = this.veiculo.id;
      this.criarFoto(false);
      veiculo.imagem = this.veiculo.imagem;
    }
    return veiculo;
  }

  private criarFoto(novo: boolean): Imagem 
  {
    const refImagem = uuid();

    let fileUpload = null;

    if (this.fotoVeiculo)
    {
      if (!novo)
      {
        const idImagem = this.veiculo.imagem.caminhoSistemaArquivos.slice(15);
        
        fileUpload = new File([this.fotoVeiculo], idImagem, {type: this.fotoVeiculo.type});
      }
      else {
        fileUpload = new File([this.fotoVeiculo], refImagem, {type: this.fotoVeiculo.type});
      }
    }
    this.fotoVeiculo = fileUpload;

    const foto = new Imagem();
    foto.caminhoSistemaArquivos = `${COLECAO_ARQUIVO.FOTOS_VEICULOS}/${refImagem}`;

    return foto;
  }

  private salvarFoto()
  {
    this.uploadService.simpleUpload(this.fotoVeiculo, COLECAO_ARQUIVO.FOTOS_VEICULOS);
  }

  private configurarFormulario(veiculo: VeiculoTransporte)
  {
    this.veiculoForm.setValue({
      campoPlaca: veiculo.placa,
      campoTipo: veiculo.tipo,
      campoCapacidade: veiculo.capacidade,
      campoCor: veiculo.cor,
      campoInstituicao: null,
      campoFoto: null
    });
  }
}
