import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AdminService } from './../../../../../services/admin.service';
import { EstudanteService } from './../../../../../services/estudante.service';
import { Estudante, PontoParada, Endereco, STATUS_COMPROVANTE } from './../../../../core/model';
import { UploadService } from './../../../../../services/upload.service';
import { StorageDataService } from './../../../../../services/storage-data.service';

@Component({
  selector: 'app-estudante-detalhes',
  templateUrl: './estudante-detalhes.component.html',
  styleUrls: ['./estudante-detalhes.component.css']
})
export class EstudanteDetalhesComponent implements OnInit, AfterViewInit 
{
  estudante: Estudante = new Estudante();
  // pontoIda: PontoParada = new PontoParada();
  // pontoVolta: PontoParada = new PontoParada();
  endereco: Endereco = new Endereco();
  
  comprovanteMatriculaLink: string;
  fotoLink: string;

  dataEnvioComprovante: any;
  instituicaoEnsino: string;
  curso: string;
  statusComprovante = null;
  marginLeftSegundaColuna = '0px';
  flexPrimeiraColuna = '1';

  comprovanteMatriculaFormGroup: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService,
      private estudanteService: EstudanteService, private formBuilder: FormBuilder,
      private snackBar: MatSnackBar, private router: Router, private uploadService: UploadService,
      private breakpointObserver: BreakpointObserver, private storageDataService: StorageDataService)
  {
    breakpointObserver.observe([
      Breakpoints.XSmall
    ]).subscribe(result => {
      if (result.matches) 
      {
        this.marginLeftSegundaColuna = '0px';
        this.flexPrimeiraColuna = '1';
      }
      else
      {
        this.marginLeftSegundaColuna = '10px';
        this.flexPrimeiraColuna = '0.5';
      }
    });
  }

  ngAfterViewInit()
  {
    this.carregarEstudante();
  }

  ngOnInit()
  {
    this.createForm();

    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Detalhes do(a) estudante';
    })
  }

  carregarEstudante()
  {
    this.estudanteService.getById(this.activatedRoute.snapshot.params['id'])
      .then(response => {

        this.estudante = response;

        this.uploadService.getFile(this.estudante.comprovanteMatricula.caminhoSistemaArquivos)
          .toPromise()
          .then((response) => {
            // console.log('linkComprovante');
            // console.log(response);
            this.comprovanteMatriculaLink = response;
          });

        this.uploadService.getFile(this.estudante.foto.caminhoSistemaArquivos)
          .toPromise()
          .then((response) => {
            // console.log('linkFoto');
            // console.log(response);
            this.fotoLink = response;
          })

        // for(let ponto of this.estudante.pontosParada)
        // {
        //   if(ponto.trajeto.tipo === 'IDA')
        //   {
        //     this.pontoIda = ponto;
        //   }
        //   else
        //   {
        //     this.pontoVolta = ponto;
        //   }
        // }
        this.endereco = this.estudante.endereco;
        this.instituicaoEnsino = this.estudante.curso.instituicaoEnsino.nome;
        this.curso = this.estudante.curso.nome;
        this.dataEnvioComprovante = this.estudante.comprovanteMatricula.dataEnvio;
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
        ativo: ativo,
        justificativaComprovante: justificativaComprovante,
        statusComprovante: statusComprovante
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
    if (this.fotoLink)
    {
      return `url(${this.fotoLink})`;
    }
  }

  private createForm()
  {
    this.comprovanteMatriculaFormGroup = this.formBuilder.group({
      campoJustificativa: [null],
    });
  }
}
