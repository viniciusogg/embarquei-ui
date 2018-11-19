import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { InstituicaoEnsinoService } from './../../../../services/instituicao-ensino.service';
import { CidadeService } from './../../../../services/cidade.service';
import { TrajetoService } from './../../../../services/trajeto.service';
import { UploadService } from './../../../../services/upload.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { EstudanteService } from './../../../../services/estudante.service';
import { Estudante, Endereco, ComprovanteMatricula, STATUS_COMPROVANTE, HorarioSemanalEstudante, DIA_SEMANA, FileUpload } from './../../../core/model';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-estudante-cadastro',
  templateUrl: './estudante-cadastro.component.html',
  styleUrls: ['./estudante-cadastro.component.css']
})
export class EstudanteCadastroComponent implements OnInit, AfterViewInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  quintoFormGroup: FormGroup

  cidade = '';
  instituicaoEnsino = '';
  curso = ''
  fotoEstudante: FileUpload;
  comprovante: FileUpload;
  progress: { percentage: number } = { percentage: 0 };

  public cidades = new Array<any>();
  public instituicoesEnsino = new Array<any>();
  public cursos = new Array<any>();
  public pontosParadaIda = new Array<any>();
  public pontosParadaVolta = new Array<any>();

  constructor(private formBuilder: FormBuilder, private router: Router,
      private instituicaoEnsinoService: InstituicaoEnsinoService, private uploadService: UploadService,
      private trajetoService: TrajetoService, private cidadeService: CidadeService,
      private estudanteService: EstudanteService, private snackBar: MatSnackBar,
      private errorHandlerService: ErrorHandlerService, private storageDataService: StorageDataService)
  {
    this.storageDataService.tituloBarraSuperior = 'Crie sua conta';
  }

  ngOnInit() {
    this.createForms();
  }

  ngOnDestroy()
  {
    this.storageDataService.tituloBarraSuperior = 'Embarquei';
  }

  ngAfterViewInit()
  {
    this.buscarCidades();
    this.buscarInstituicoesEnsino();
  }

  salvar()
  {
    const estudante = this.criarEstudante();

    this.estudanteService.cadastrarEstudante(estudante)
      .then((estudanteAdicionado) => {

        this.router.navigate(['/login']);

        this.snackBar.open('Estudante cadastrado com sucesso', '', { duration: 3500});
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro);

        // REMOVER FOTO E COMPROVANTE
      });
  }

  private criarEstudante(): Estudante
  {
    const estudante = new Estudante();

    estudante.nome = this.firstFormGroup.get('campoNome').value;
    estudante.sobrenome = this.firstFormGroup.get('campoSobrenome').value;
    estudante.numeroCelular = this.firstFormGroup.get('campoNumeroCelular').value;
    estudante.senha = this.quintoFormGroup.get('campoConfirmacaoSenha').value;
    estudante.foto = this.fotoEstudante.url;
    estudante.ativo = false;

    estudante.endereco = this.criarEndereco();
    estudante.comprovanteMatricula = this.criarComprovanteMatricula();
    estudante.curso = {id: this.thirdFormGroup.get('campoCurso').value};
    estudante.horariosSemanaisEstudante = this.criarHorarioSemanalEstudante();
    estudante.pontosParada = this.criarPontoParada();

    return estudante;
  }

  private salvarFoto()
  {
    // console.log(this.fotoEstudante);

    // const file = this.selectedFiles.item(0);
    // this.selectedFiles = undefined;

    // this.fotoEstudante = new FileUpload(file);

    this.uploadService.pushFileToStorage(this.fotoEstudante, this.progress, 'fotos-perfil');
  }

  private salvarComprovante()
  {
    this.uploadService.pushFileToStorage(this.comprovante, this.progress, 'comprovantes-matricula')
  }

  private criarEndereco(): Endereco
  {
    const endereco = new Endereco();

    endereco.cidade = {id: this.cidades.filter(cidadeFiltrada =>
      this.secondFormGroup.get('campoCidade').value === cidadeFiltrada.nome)[0].id};

    endereco.bairro = this.secondFormGroup.get('campoBairro').value;
    endereco.logradouro = this.secondFormGroup.get('campoLogradouro').value;

    return endereco;
  }

  private criarComprovanteMatricula(): ComprovanteMatricula
  {
    const comprovanteMatricula = new ComprovanteMatricula();

    comprovanteMatricula.caminhoSistemaArquivos = this.comprovante.url;
    comprovanteMatricula.status = STATUS_COMPROVANTE.EM_ANALISE;
    comprovanteMatricula.dataEnvio = new Date();
    comprovanteMatricula.justificativa = '-';

    return comprovanteMatricula;
  }

  private criarHorarioSemanalEstudante(): Array<HorarioSemanalEstudante>
  {
    const horariosSemanaisEstudante = new Array<HorarioSemanalEstudante>();

    const segunda = new HorarioSemanalEstudante(DIA_SEMANA.SEGUNDA, true);
    const terca = new HorarioSemanalEstudante(DIA_SEMANA.TERCA, true);
    const quarta = new HorarioSemanalEstudante(DIA_SEMANA.QUARTA, true);
    const quinta = new HorarioSemanalEstudante(DIA_SEMANA.QUINTA, true);
    const sexta = new HorarioSemanalEstudante(DIA_SEMANA.SEXTA, true);

    horariosSemanaisEstudante.push(segunda, terca, quarta, quinta, sexta);

    return horariosSemanaisEstudante;
  }

  private criarPontoParada(): Array<any>
  {
    let pontosParada: any = [
      {id: this.fourthFormGroup.get('campoPontoIda').value},
      {id: this.fourthFormGroup.get('campoPontoVolta').value}
    ];

    return pontosParada;
  }

  private createForms()
  {
    this.firstFormGroup = this.formBuilder.group({
      campoFoto: [null, Validators.required],
      campoNome: [null, Validators.required],
      campoSobrenome: [null, Validators.required],
      campoNumeroCelular: [null, Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      campoCidade: [null, Validators.required],
      campoLogradouro: [null, Validators.required],
      campoBairro: [null, Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({
      campoInstituicaoEnsino: [null, Validators.required],
      campoCurso: [null, Validators.required],
      campoComprovante: [null, Validators.required]
    });

    this.fourthFormGroup = this.formBuilder.group({
      campoPontoIda: [null, Validators.required],
      campoPontoVolta: [null, Validators.required]
    });

    this.quintoFormGroup = this.formBuilder.group({
      campoNovaSenha: [null, Validators.required],
      campoConfirmacaoSenha: [null, Validators.required],
    });
  }

  onFotoInput(event)
  {
    //    this.fotoEstudante = event.target.files[0]['name'];
    this.fotoEstudante = new FileUpload(event.target.files[0]);
  }

  onComprovanteInput(event)
  {
    this.comprovante = new FileUpload(event.target.files[0])
  }

  removerFotoCarregada()
  {
    this.fotoEstudante = null;
  }

  removerComprovanteCarregado()
  {
    this.comprovante = null;
  }

  verificarSenhasDiferentes()
  {
    if (this.quintoFormGroup.get('campoNovaSenha').value ===
        this.quintoFormGroup.get('campoConfirmacaoSenha').value)
    {
      return false;
    }
    return true;
  }

  isSenhasDiferentes()
  {
    return this.verificarSenhasDiferentes();
  }

  buscarInstituicoesEnsino()
  {
    this.instituicaoEnsinoService.getAll()
      .then(response => {

        this.instituicoesEnsino = response.instituicoes;

        // for (const instituicao of response.instituicoes)
        // {
        //   this.cursos = instituicao.cursos;
        // }
        // console.log(response.instituicoes);
      })
  }

  buscarCidades()
  {
    this.cidadeService.getAll()
      .then(response => {

        this.cidades = response.cidades;
        // console.log(response.cidades);
        // console.log(this.cidades);
      });
  }

  buscarPontosParada()
  {
    let cidadeId;
    let instituicaoId;

    for (const cidade of this.cidades)
    {
      if (cidade.nome === this.secondFormGroup.get('campoCidade').value)
      {
        cidadeId = cidade.id;
      }
    }

    for (const instituicaoEnsino of this.instituicoesEnsino)
    {
      if (instituicaoEnsino.nome === this.thirdFormGroup.get('campoInstituicaoEnsino').value)
      {
        instituicaoId = instituicaoEnsino.id;
      }
    }

    this.trajetoService.getPontosParada(cidadeId, instituicaoId)
      .then(response => {

        // console.log(response.trajetos);
        for(const trajeto of response.trajetos)
        {
          if(trajeto.tipo === 'IDA')
          {
            this.pontosParadaIda = trajeto.pontosParada;
          }
          else
          {
            this.pontosParadaVolta = trajeto.pontosParada;
          }
        }
      })
      .catch(erro => {
        this.errorHandlerService.handle(erro)
      });
  }

  alterarCursos(instituicaoEnsino)
  {
  //   const usuarioPublico: Usuario = this.usuarios.filter(usuarioFiltrado =>
  //     usuarioFiltrado.nome === 'Public')[0];

    const instituicao = this.instituicoesEnsino.filter(instituicaoFiltrada =>
      instituicaoFiltrada.nome === instituicaoEnsino)[0];

    this.cursos = instituicao.cursos;
  }
}

