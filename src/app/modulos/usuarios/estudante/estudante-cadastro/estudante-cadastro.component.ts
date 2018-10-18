import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { EstudanteService } from './../estudante.service';
import { Estudante, Endereco, ComprovanteMatricula, STATUS_COMPROVANTE, HorarioSemanalEstudante, DIA_SEMANA, PontoParada } from './../../../core/model';
import { StorageDataService } from './../../../../storage-data.service';

@Component({
  selector: 'app-estudante-cadastro',
  templateUrl: './estudante-cadastro.component.html',
  styleUrls: ['./estudante-cadastro.component.css']
})
export class EstudanteCadastroComponent implements OnInit {

  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  thirdFormGroup: FormGroup
  fourthFormGroup: FormGroup

  cidade = '';
  instituicaoEnsino = '';
  curso = ''

  cidades = [{nome: 'Sertânia'}, {nome: 'Sumé'}];
  instituicoesEnsino = [{nome: 'IFPB - Monteiro'}];
  cursos = [{nome: 'ADS'}, {nome: 'Construção'}]

  constructor(private formBuilder: FormBuilder, private router: Router,
      private estudanteService: EstudanteService, private snackBar: MatSnackBar,
      private errorHandlerService: ErrorHandlerService, private storageDataService: StorageDataService)
  {
    storageDataService.tituloBarraSuperior = 'Crie sua conta';
  }

  ngOnInit() {
    this.createForms();
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
    });
  }

  private criarEstudante(): Estudante
  {
    const estudante = new Estudante();

    estudante.nome = this.firstFormGroup.get('campoNome').value;
    estudante.sobrenome = this.firstFormGroup.get('campoSobrenome').value;
    estudante.numeroCelular = this.firstFormGroup.get('campoNumeroCelular').value;
    estudante.senha = this.fourthFormGroup.get('campoConfirmacaoSenha').value;
    estudante.foto = 'caminho/sistema/de/arquivos/foto.png'
    estudante.ativo = false;

    estudante.endereco = this.criarEndereco();
    estudante.comprovanteMatricula = this.criarComprovanteMatricula();
    estudante.curso = this.thirdFormGroup.get('campoCurso').value;
    estudante.HorariosSemanaisEstudante = this.criarHorarioSemanalEstudante(estudante);
    estudante.pontosParada = this.criarPontoParada();

    return estudante;
  }

  private criarEndereco(): Endereco
  {
    const endereco = new Endereco();

    endereco.cidade = this.secondFormGroup.get('campoCidade').value;
    endereco.bairro = this.secondFormGroup.get('campoBairro').value;
    endereco.logradouro = this.secondFormGroup.get('campoLogradouro').value;

    return endereco;
  }

  private criarComprovanteMatricula(): ComprovanteMatricula
  {
    const comprovanteMatricula = new ComprovanteMatricula();

    comprovanteMatricula.arquivo = 'caminho/sistema/de/arquivos/comprovante.pdf';
    comprovanteMatricula.status = STATUS_COMPROVANTE.EM_ANALISE;
    comprovanteMatricula.dataEnvio = new Date();
    comprovanteMatricula.justificativa = '';

    return comprovanteMatricula;
  }

  private criarHorarioSemanalEstudante(estudante: Estudante): Array<HorarioSemanalEstudante>
  {
    const horariosSemanaisEstudante = new Array<HorarioSemanalEstudante>();

    const segunda = new HorarioSemanalEstudante(DIA_SEMANA.SEGUNDA, estudante);
    const terca = new HorarioSemanalEstudante(DIA_SEMANA.TERCA, estudante);
    const quarta = new HorarioSemanalEstudante(DIA_SEMANA.QUARTA, estudante);
    const quinta = new HorarioSemanalEstudante(DIA_SEMANA.QUINTA, estudante);
    const sexta = new HorarioSemanalEstudante(DIA_SEMANA.SEXTA, estudante);

    horariosSemanaisEstudante.push(segunda, terca, quarta, quinta, sexta);

    return horariosSemanaisEstudante;
  }

  private criarPontoParada(): Array<PontoParada>
  {
    const pontosParada = Array<PontoParada>();

    const pontoEspera = new PontoParada();
    pontoEspera.nome = 'INSS';

    const pontoDescida = new PontoParada();
    pontoDescida.nome = 'Hospital'

    pontosParada.push(pontoEspera);
    pontosParada.push(pontoDescida);

    return pontosParada;
  }

  private createForms()
  {
    this.firstFormGroup = this.formBuilder.group({
      campoNome: [null, [Validators.required]],
      campoSobrenome: [null, Validators.required],
      campoNumeroCelular: [null, Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      campoCidade: [null, [Validators.required]],
      campoLogradouro: [null, Validators.required],
      campoBairro: [null, Validators.required]
    });

    this.thirdFormGroup = this.formBuilder.group({
      campoInstituicaoEnsino: [null, [Validators.required]],
      campoCurso: [null, Validators.required],
    });

    this.fourthFormGroup = this.formBuilder.group({
      campoNovaSenha: [null, [Validators.required]],
      campoConfirmacaoSenha: [null, Validators.required],
    });
  }

  verificarSenhasDiferentes()
  {
    if (this.fourthFormGroup.get('campoNovaSenha').value ===
        this.fourthFormGroup.get('campoConfirmacaoSenha').value) {
      return false;
    }
    return true;
  }

  isSenhasDiferentes()
  {
    return this.verificarSenhasDiferentes();
  }

}
