import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from './../../../../services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstudanteService } from './../../../../services/estudante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudante, PontoParada, Endereco, STATUS_COMPROVANTE } from './../../../core/model';
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatRadioGroup } from '@angular/material';

@Component({
  selector: 'app-estudante-detalhes',
  templateUrl: './estudante-detalhes.component.html',
  styleUrls: ['./estudante-detalhes.component.css']
})
export class EstudanteDetalhesComponent implements OnInit, AfterViewInit {

  estudante: Estudante = new Estudante();
  pontoIda: PontoParada = new PontoParada();
  pontoVolta: PontoParada = new PontoParada();
  endereco: Endereco = new Endereco();
  dataEnvioComprovante: any;
  instituicaoEnsino: string;
  curso: string;
  statusComprovante = null;

  comprovanteMatriculaFormGroup: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService,
      private estudanteService: EstudanteService, private formBuilder: FormBuilder,
      private snackBar: MatSnackBar, private router: Router)
  {}

  ngAfterViewInit()
  {
    this.carregarEstudante();
  }

  ngOnInit()
  {
    this.createForm();
  }

  carregarEstudante()
  {
    this.estudanteService.getById(this.activatedRoute.snapshot.params['id'])
      .then(estudante => {

        this.estudante = estudante;

        for(let ponto of estudante.pontosParada)
        {
          if(ponto.trajeto.tipo === 'IDA')
          {
            this.pontoIda = ponto;
          }
          else
          {
            this.pontoVolta = ponto;
          }
        }
        this.endereco = estudante.endereco;
        this.instituicaoEnsino = estudante.curso.instituicaoEnsino.nome;
        this.curso = estudante.curso.nome;
        this.dataEnvioComprovante = estudante.comprovanteMatricula.dataEnvio;
      })
      .catch(erro => console.log(erro));
  }

  salvar()
  {
    const valorCampoJustificativa = this.comprovanteMatriculaFormGroup.get('campoJustificativa').value;

    const ativo = this.statusComprovante === 'false' ? false : (this.statusComprovante === 'true' ? true : null);
    const justificativaComprovante = valorCampoJustificativa === null ? '-' : valorCampoJustificativa;
    const statusComprovante = ativo ? STATUS_COMPROVANTE.APROVADO : STATUS_COMPROVANTE.RECUSADO;

    const dados = JSON.stringify(
      {
        "ativo": ativo,
        "justificativaComprovante": justificativaComprovante,
        "statusComprovante": statusComprovante
      });

    this.adminService.atualizarStatusEstudante(this.estudante.id, dados)
      .then(() => {
        this.router.navigate(['/estudantes'])
        this.snackBar.open('Atualizado com sucesso!', '', { duration: 3500});
      })
      .catch(erro => console.log(erro));
  }


  adicionarValidador()
  {
    this.comprovanteMatriculaFormGroup.get('campoJustificativa').setValidators(Validators.required);

    if (this.comprovanteMatriculaFormGroup.get('campoJustificativa').value === null)
    {
      this.comprovanteMatriculaFormGroup.setValue({campoJustificativa: null});
    }
  }

  removerValidador()
  {
    this.comprovanteMatriculaFormGroup.clearValidators();

    if (this.comprovanteMatriculaFormGroup.get('campoJustificativa').value !== null)
    {
      this.comprovanteMatriculaFormGroup.setValue({campoJustificativa: null});
    }
  }

  url()
  {
    return `url(${this.estudante.foto})`;
  }

  private createForm()
  {
    this.comprovanteMatriculaFormGroup = this.formBuilder.group({
      campoJustificativa: [null],
    });
  }
}
