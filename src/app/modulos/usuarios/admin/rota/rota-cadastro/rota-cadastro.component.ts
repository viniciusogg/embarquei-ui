import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormControlName } from '@angular/forms';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef, MatAccordion, MatInput } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituicaoEnsino, Rota, Cidade, Motorista, Trajeto, TIPO_TRAJETO, PontoParada, Geolocalizacao, HorarioTrajeto } from './../../../../../modulos/core/model';

import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { CidadeService } from './../../../../../services/cidade.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';
import { AdminService } from './../../../../../services/admin.service';
import { RotaService } from './../../../../../services/rota.service';
import { TrajetoService } from './../../../../../services/trajeto.service';

import { AjudaDialog } from '../../../comum/ajuda-dialog/ajuda-dialog';
import { ManipuladorTempo } from './../../../comum/manipulador-tempo';
import { ValidadorHora } from '../../../comum/validadores-personalizados/validador-hora';
import { ValidadorNomePonto } from '../../../comum/validadores-personalizados/validador-nome-ponto';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ConfirmacaoDialog } from '../../../comum/confirmacao-dialog/confirmacao-dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.css']
})
export class RotaCadastroComponent implements OnInit 
{
  rotaForm: FormGroup;
  trajetoForm: FormGroup; // Formulário para edição de trajetos na aba TRAJETOS

  trajetoIda: Trajeto;
  trajetosIda: Array<Trajeto>;
  trajetoVolta: Trajeto;
  trajetosVolta: Array<Trajeto>;
  rota: Rota;
  isMobile = false;
  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  instituicaoEnsino: InstituicaoEnsino;
  instituicoesEnsino = new Array<InstituicaoEnsino>();
  desabilitarCampoBotaoInstituicoes = true;

  public mascaraHora = [/\d/, /\d/, ':', /\d/, /\d/];
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(private storageDataService: StorageDataService, private cidadeService: CidadeService,
    private breakpointObserver: BreakpointObserver, private instituicaoEnsinoService: InstituicaoEnsinoService,
    private errorHandlerService: ErrorHandlerService, private dialog: MatDialog, private formBuilder: FormBuilder,
    private adminService: AdminService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private rotaService: RotaService, private router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private trajetoService: TrajetoService) 
  {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      if (result.matches) 
      {
        this.isMobile = true
      }
      else 
      {
        this.isMobile = false;
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 320px)'); //700

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  
  ngOnInit() 
  {
    const idRota = this.activatedRoute.snapshot.params['id'];

    if (idRota)
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Atualização de rota';
      });
      this.carregarRota(idRota);
    }
    else 
    {
      setTimeout(() => {
        this.storageDataService.tituloBarraSuperior = 'Cadastro de veículo';
      });
    }
    this.criarFormulario();
    this.criarFormularioEdicaoTrajetos();
    
    if (!this.storageDataService.usuarioLogado)
    {
      this.adminService.getById(localStorage.getItem('idUsuarioLogado'))
        .then(response => {
          this.storageDataService.usuarioLogado = response;
        })
        .then(() => {
          const cidadeId = this.storageDataService.usuarioLogado.endereco.cidade.id;
      
          this.cidadeService.getById(cidadeId)
            .then(response => {
              this.storageDataService.usuarioLogado.endereco.cidade = response;
            })
            .catch(erro => this.errorHandlerService.handle(erro));
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
    this.buscarInstituicoesEnsino();
  }

  private criarFormulario()
  {
    this.rotaForm = this.formBuilder.group({
      // campoNomeRota: [null, Validators.required],
      campoDescricaoTrajetoIda : ['', Validators.required],
      campoDescricaoTrajetoVolta: ['', Validators.required],
      campoHorarioPartidaIda: ['', [Validators.required, Validators.minLength(5), ValidadorHora.validateHour, Validators.maxLength(5)]],
      campoHorarioPartidaVolta: ['', [Validators.required, Validators.minLength(5), ValidadorHora.validateHour, Validators.maxLength(5)]],
      campoInstituicao: [null]
    });
  }
  
  carregarRota(idRota)
  {
    this.rotaService.buscarRotaPorId(idRota)
      .then((response) => {
        this.rota = response;

        this.setTrajetos();

        this.trajetoIda = this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA && trajeto.ativado)[0];
        this.trajetoIda.pontosParada = this.ordenarPontos(this.trajetoIda.pontosParada);

        this.trajetoVolta = this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA && trajeto.ativado)[0];
        this.trajetoVolta.pontosParada = this.ordenarPontos(this.trajetoVolta.pontosParada);

        this.instituicaoEnsino = this.rota.instituicoesEnsino[0];
        this.configurarFormulario(this.rota);

        this.dataSourceInstituicoes.data = this.rota.instituicoesEnsino;
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  private configurarFormulario(rota: Rota)
  {
    this.rotaForm.setValue({
      campoDescricaoTrajetoIda: rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA && trajeto.ativado)[0].descricao,
      campoDescricaoTrajetoVolta: rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA && trajeto.ativado)[0].descricao,
      campoHorarioPartidaIda: rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA && trajeto.ativado)[0].horarioTrajeto.partida,
      campoHorarioPartidaVolta: rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA && trajeto.ativado)[0].horarioTrajeto.partida,
      campoInstituicao: rota.instituicoesEnsino[0],
    });
  }

  buscarInstituicoesEnsino()
  {
    this.instituicaoEnsinoService.getAll()
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
    const instituicaoEnsino: InstituicaoEnsino = this.rotaForm.get('campoInstituicao').value;
    
    if (instituicaoEnsino)
    {
      const instituicoes: InstituicaoEnsino[] = this.dataSourceInstituicoes.data;
  
      const instituicaoEncontradaTabela = instituicoes.filter(instituicao =>
          instituicao.id === instituicaoEnsino.id)[0];
  
      if (!instituicaoEncontradaTabela)
      {
        instituicoes.push(this.rotaForm.get('campoInstituicao').value);
    
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

  private ordenarPontos(pontosParada: PontoParada[])
  {
    pontosParada.sort((n1, n2) => n1.ordem - n2.ordem);

    return pontosParada;
  }

  // trajeto pode ser o tipo do trajeto ou o objeto Trajeto
  abrirMapa(trajeto)
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;
   
    if (trajeto.id) // LISTAGEM DE TRAJETOS
    {
      // console.log(trajeto);
      let horaPartida: any = this.trajetoForm.get(trajeto.horarioTrajeto.nomeCampo).value;
          
      // SE O TRAJETO É DE IDA, PEGAR GEOLOCALIZAÇÃO DA CIDADE DO ADMIN, SENÃO, PEGAR A GEOLOCALIZAÇÃO 
      // DO ÚLTIMO PONTO DE PARADA DO TRAJETO DE IDA.
      let geolocalizacao: any = trajeto.tipo === TIPO_TRAJETO.IDA ? usuarioLogado.endereco.cidade.geolocalizacao : 
          this.trajetoIda.pontosParada[this.trajetoIda.pontosParada.length - 1].geolocalizacao;

      const dialogRef = this.dialog.open(MapaDialogComponent, {
        height: '95%',
        width: '95%',
        id: 'mapa-dialog',
        maxWidth: '96vw',
        disableClose: true,
        data: {
          tipoTrajeto: trajeto.tipo,
          trajeto: trajeto.pontosParada.length > 0 ? trajeto : undefined,
          // horarioTrajetoId: trajeto.horarioTrajeto.id,
          horaPartida: horaPartida,
          geolocalizacao: geolocalizacao
        }
      });
      dialogRef.afterClosed().toPromise()
        .then(result =>
        {//console.log(result);
          if (result)
          {
            // this.adicionarHorariosTrajeto(result);

            // if (result.tipo === 'IDA')
            // {
            //   this.trajetoIda = result;
            // }
            // else
            // {
            //   this.trajetoVolta = result;
            // }
            // trajeto.horarioTrajeto.id = result.horarioTrajeto.id;
            trajeto.horarioTrajeto.partida = result.horarioTrajeto.partida;
            trajeto.horarioTrajeto.chegada = result.horarioTrajeto.chegada;
            trajeto.pontosParada = result.pontosParada;
          }
        });
      }
    else
    {
      let novoTrajeto: Trajeto;

      let horaPartida: any = trajeto === TIPO_TRAJETO.IDA ? 
          this.rotaForm.get('campoHorarioPartidaIda').value : 
          this.rotaForm.get('campoHorarioPartidaVolta').value;

      // SE O TRAJETO É DE IDA, PEGAR GEOLOCALIZAÇÃO DA CIDADE DO ADMIN, SENÃO, PEGAR A GEOLOCALIZAÇÃO 
      // DO ÚLTIMO PONTO DE PARADA DO TRAJETO DE IDA.
      let geolocalizacao: any = trajeto === TIPO_TRAJETO.IDA ? usuarioLogado.endereco.cidade.geolocalizacao : 
          this.trajetoIda.pontosParada[this.trajetoIda.pontosParada.length - 1].geolocalizacao;
  
      if (this.rota)
      {
        novoTrajeto = trajeto === TIPO_TRAJETO.IDA ? 
            this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA && trajeto.ativado)[0] :
            this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA && trajeto.ativado)[0];
      }
      const dialogRef = this.dialog.open(MapaDialogComponent, {
        height: '95%',
        width: '99%',
        id: 'mapa-dialog',
        maxWidth: '96vw',
        disableClose: true,
        data: {
          tipoTrajeto: trajeto,
          trajeto: novoTrajeto,
          horaPartida: horaPartida,
          geolocalizacao: geolocalizacao
        }
      });
      dialogRef.afterClosed().toPromise()
        .then(result => //{ .subscribe(result =>
        {
          if (result)
          {
            // console.log(result);
            this.adicionarHorariosTrajeto(result);
  
            if (result.tipo === 'IDA')
            {
              this.trajetoIda = result;
            }
            else
            {
              this.trajetoVolta = result;
            }
          }
        });
    }
  }

  private adicionarHorariosTrajeto(trajeto: Trajeto)
  {
    if (trajeto.tipo === TIPO_TRAJETO.IDA)
    {
      this.trajetoIda = trajeto;
      this.trajetoIda.horarioTrajeto.id = trajeto.horarioTrajeto.id;
      this.trajetoIda.horarioTrajeto.partida = this.rotaForm.get('campoHorarioPartidaIda').value;
      this.trajetoIda.horarioTrajeto.chegada = trajeto.horarioTrajeto.chegada;
    }
    else if (trajeto.tipo === TIPO_TRAJETO.VOLTA)
    {
      this.trajetoVolta = trajeto;
      this.trajetoVolta.horarioTrajeto.id = trajeto.horarioTrajeto.id;
      this.trajetoVolta.horarioTrajeto.partida = this.rotaForm.get('campoHorarioPartidaVolta').value;
      this.trajetoVolta.horarioTrajeto.chegada = trajeto.horarioTrajeto.chegada;
    }
  }

  private criarRota(id?): Rota
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;

    const rota = new Rota();

    if (id)
    {
      rota.id = id;
      
      for (let trajeto of this.rota.trajetos)
      {
        if (trajeto.ativado)
        {
          if (trajeto.tipo === TIPO_TRAJETO.IDA)
          {
            trajeto.descricao = this.rotaForm.get('campoDescricaoTrajetoIda').value;
          }
          else 
          {
            trajeto.descricao = this.rotaForm.get('campoDescricaoTrajetoVolta').value;
          }
        }
      }
      rota.trajetos = this.rota.trajetos;
    }
    else
    {
      const trajetos: Trajeto[] = new Array<Trajeto>();

      this.trajetoIda.descricao = this.rotaForm.get('campoDescricaoTrajetoIda').value;

      this.trajetoVolta.descricao = this.rotaForm.get('campoDescricaoTrajetoVolta').value;

      trajetos.push(this.trajetoIda);
      trajetos.push(this.trajetoVolta);

      rota.trajetos = trajetos;
    }
    rota.cidade = usuarioLogado.endereco.cidade;
    rota.instituicoesEnsino = this.dataSourceInstituicoes.data;

    return rota;
  }

  salvar()
  {
    const rota: Rota = this.criarRota();

    this.rotaService.cadastrar(rota)
      .then(() => 
      {
        this.router.navigate(['/rotas']);

        this.snackBar.open('Rota criada com sucesso', '', { duration: 3500});
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }

  atualizar()
  {
    const rota: Rota = this.criarRota(this.rota.id);

    return this.rotaService.atualizar(rota)
      .then(response => 
      {
        this.snackBar.open('Atualizada com sucesso', '', { duration: 3500 });

        this.rota = response;
      })
      .catch(erro => this.errorHandlerService.handle(erro))
  }

  exibirMsgErro(msg)
  {
    this.snackBar.open(
      msg, '', {panelClass: ['snack-bar-error'], duration: 4500}
    );
  }

  abrirAjuda(tipoAjuda: string)
  {
    this.dialog.open(AjudaRotaDialogComponent, {
      height: tipoAjuda === 'trajetoIda' || tipoAjuda === 'trajetoVolta' ? '70%' : '90%', 
      width: '99%',
      data: {
        tipoAjuda: tipoAjuda,
      }
    });
  }

  atualizarHorario(velhoHorarioPartidaTrajeto, velhoHorarioChegadaTrajeto, 
      novoHorarioPartidaTrajeto, trajeto: Trajeto)
  {
    if (velhoHorarioPartidaTrajeto && novoHorarioPartidaTrajeto)
    {
      if (novoHorarioPartidaTrajeto !== velhoHorarioPartidaTrajeto)
      {
        let segundosVelhoHorarioPartida: number = ManipuladorTempo.converterTempoTotalTrajetoParaSegundos(velhoHorarioPartidaTrajeto);
        let segundosVelhoHorarioChegada: number = ManipuladorTempo.converterTempoTotalTrajetoParaSegundos(velhoHorarioChegadaTrajeto);
        let novoHorarioChegada: string;

        let tempoTotalTrajeto: number = Math.abs(Number(JSON.parse(JSON.stringify(segundosVelhoHorarioPartida))).valueOf() - Number(JSON.parse(JSON.stringify(segundosVelhoHorarioChegada))).valueOf());

        let tempoTotalTrajetoFormatado = ManipuladorTempo.formatarHorarioTrajeto(tempoTotalTrajeto);

        novoHorarioChegada = ManipuladorTempo.calcularHoraChegada(novoHorarioPartidaTrajeto, tempoTotalTrajetoFormatado);

        trajeto.horarioTrajeto.partida = novoHorarioPartidaTrajeto;
        trajeto.horarioTrajeto.chegada = novoHorarioChegada;
      }
    }
  }

  private setTrajetos()
  {
    this.trajetosIda = new Array<Trajeto>();
    this.trajetosVolta = new Array<Trajeto>();

    for (let trajeto of this.rota.trajetos)
    {
      trajeto.nomeCampo = uuid();
      trajeto.horarioTrajeto.nomeCampo = uuid();

      if (trajeto.tipo === TIPO_TRAJETO.IDA)
      {
        this.trajetosIda.push(trajeto);
      }
      else
      {
        this.trajetosVolta.push(trajeto);
      }
      // CAMPO DESCRIÇÃO
      this.trajetoForm
          .addControl(trajeto.nomeCampo, new FormControl(trajeto.descricao, Validators.required));

      // CAMPO HORARIO PARTIDA TRAJETO
      this.trajetoForm.
          addControl(trajeto.horarioTrajeto.nomeCampo, new FormControl(trajeto.horarioTrajeto.partida, [
              Validators.required, 
              Validators.minLength(5), 
              ValidadorHora.validateHour, 
              Validators.maxLength(5)
            ]));
    }
  }

  abrirDialogTrajetos(tipoTrajeto)
  {
    const dialogRef = this.dialog.open(TrajetoListagemDialogComponent, {
      height: '95%',
      width: '99%',
      maxWidth: '96vw',
      data: {
        tipoTrajeto: tipoTrajeto,
        trajetos: tipoTrajeto === TIPO_TRAJETO.IDA ? this.trajetosIda : this.trajetosVolta 
      }
    });
    dialogRef.afterClosed().toPromise()
      .then((response) => 
      {
        if (response)
        {
          this.atualizarTrajetoEscolhido(response);
        }
      });
  }

  adicionarTrajeto(tipo: string)
  {
    const idCampoTrajeto = uuid();
    const idCampoHorario = uuid();

    const trajeto = new Trajeto();
    trajeto.ativado = false;
    // trajeto.id = idCampoTrajeto;
    trajeto.nomeCampo = idCampoTrajeto
    trajeto.horarioTrajeto = new HorarioTrajeto();
    trajeto.horarioTrajeto.nomeCampo = idCampoHorario;
    trajeto.pontosParada = new Array<PontoParada>();
    
    this.trajetoForm.addControl(idCampoTrajeto, new FormControl('', Validators.required));
    this.trajetoForm.addControl(idCampoHorario, new FormControl('', [
      Validators.required, 
      Validators.minLength(5), 
      ValidadorHora.validateHour, 
      Validators.maxLength(5)
    ]));
    if (tipo === TIPO_TRAJETO.IDA)
    {
      trajeto.tipo = TIPO_TRAJETO.IDA;

      this.trajetosIda.push(trajeto);
    }
    else
    {
      trajeto.tipo = TIPO_TRAJETO.VOLTA;

      this.trajetosVolta.push(trajeto);
    }
  }

  private criarFormularioEdicaoTrajetos()
  {
    this.trajetoForm = this.formBuilder.group({});
  }

  salvarTrajeto(trajeto: Trajeto)
  {
    // VERIFICANDO SE É UM NOVO TRAJETO
    // SE FOR NOVO, ELE É ADICIONADO À ROTA E ELA É ATUALIZADA
    if (!trajeto.rota) 
    {
      this.trajetoService.salvar(trajeto, this.rota)
        .then(response => 
        {
          trajeto.ativado = response.ativado;
          trajeto.descricao = response.descricao;
          trajeto.horarioTrajeto.id = response.horarioTrajeto.id;
          trajeto.horarioTrajeto.partida = response.horarioTrajeto.partida;
          trajeto.horarioTrajeto.chegada = response.horarioTrajeto.chegada;
          trajeto.id = response.id;
          trajeto.pontosParada = response.pontosParada;
          trajeto.rota = response.rota;
          trajeto.tipo = response.tipo;

          this.snackBar.open('Salvo com sucesso', '', {duration: 3500})
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
    else 
    {
      this.trajetoService.atualizar(trajeto, this.rota)
        .then(response => 
        {
          // SETAR TRAJETO ANTIGO COM A RESPONSE
          trajeto.ativado = response.ativado;
          trajeto.descricao = response.descricao;
          trajeto.horarioTrajeto.id = response.horarioTrajeto.id;
          trajeto.horarioTrajeto.partida = response.horarioTrajeto.partida;
          trajeto.horarioTrajeto.chegada = response.horarioTrajeto.chegada;
          trajeto.id = response.id;
          trajeto.pontosParada = response.pontosParada;
          trajeto.rota = response.rota;
          trajeto.tipo = response.tipo;

          this.snackBar.open('Atualizado com sucesso', '', {duration: 3500})
        })
        .catch(erro => this.errorHandlerService.handle(erro));
    }
    this.trajetoForm.get(trajeto.nomeCampo).markAsPristine();
    this.trajetoForm.get(trajeto.horarioTrajeto.nomeCampo).markAsPristine();
  }

  atualizarTrajetoEscolhido(trajeto: Trajeto)
  {
    if (trajeto.tipo === TIPO_TRAJETO.IDA)
    {
      for (let t of this.trajetosIda)
      {
        if (t.ativado)
        {
          t.ativado = false;

          trajeto.ativado = true;

          this.trajetoIda = trajeto;

          this.rotaForm.get('campoDescricaoTrajetoIda').setValue(trajeto.descricao);
          this.rotaForm.get('campoHorarioPartidaIda').setValue(trajeto.horarioTrajeto.partida);

          this.salvarTrajeto(t);
          this.salvarTrajeto(trajeto);

          return;
        }
      }
    }
    else
    {
      for (let t of this.trajetosVolta)
      {
        if (t.ativado)
        {
          t.ativado = false;

          trajeto.ativado = true;

          this.trajetoVolta = trajeto;

          this.rotaForm.get('campoDescricaoTrajetoVolta').setValue(trajeto.descricao);
          this.rotaForm.get('campoHorarioPartidaVolta').setValue(trajeto.horarioTrajeto.partida);

          this.salvarTrajeto(t);
          this.salvarTrajeto(trajeto);

          return;
        }
      }
    }
  }

  excluirTrajeto(trajeto: Trajeto)
  {
    if (trajeto.id)
    {
      const dialogRef = this.dialog.open(ConfirmacaoExclusaoTrajetoDialogComponent, {
        height: '60%',
        disableClose: true,
        data: {
          trajeto: trajeto
        }
      });
      dialogRef.afterClosed().toPromise()
        .then(result =>
        {
          if (result)
          {
            this.trajetoService.remover(trajeto.id).
              then(() => 
              {
                this.removerTrajetoLocal(trajeto);
  
                this.snackBar.open('Excluído com sucesso', '', {duration: 3500})
              })
              .catch(erro => this.errorHandlerService.handle(erro));
          }
        });
    }
    else
    {
      this.removerTrajetoLocal(trajeto);
    }
  }

  private removerTrajetoLocal(trajeto: Trajeto)
  {
    this.rota.trajetos.splice(this.rota.trajetos.indexOf(trajeto), 1);
  
    if (trajeto.tipo === TIPO_TRAJETO.IDA)
    {
      this.trajetosIda.splice(this.trajetosIda.indexOf(trajeto), 1);
    }
    else
    {
      this.trajetosVolta.splice(this.trajetosVolta.indexOf(trajeto), 1);
    }
  }
}


@Component({
  selector: 'app-mapa-dialog',
  templateUrl: 'mapa-dialog/mapa-dialog.component.html',
  styleUrls: [ 'mapa-dialog/mapa-dialog.component.css']
})
export class MapaDialogComponent implements OnInit 
{
  form: FormGroup;
  ajudaVisivel = false;
  tipoTrajeto = '';
  // trajeto: Trajeto;

  // Dados agregados do trajeto
  tempoTotalTrajeto: string;
  distancia: number;
  partida: string;
  chegada: string;

  // AGM MAP
  geolocalizacaoMapa: Geolocalizacao;
  zoom: number = 15;
  markers: Marker[] = [];
  
  // AGM DIRECTION
  rotaVisivel = false;
  pontosParada: Waypoint[] = [];
  pontosParadaAtualizados: any[] = [];
  origemRota: any = {};  // lat, lng
  destinoRota: any = {}; // lat, lng

  renderOptions: any = {
    draggable: true,
    suppressInfoWindows: true,
    markerOptions: {
      icon: {
        url: '/assets/icons/map-marker-final.png'
      }
    }
  }
  optimizeWaypoints = false;
  transitOptions: any;
  drivingOptions: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
      private snackBar: MatSnackBar, private dialogRef: MatDialogRef<MapaDialogComponent>) 
  {}

  ngOnInit() 
  {
    this.criarFormulario();

    this.tipoTrajeto = this.data.tipoTrajeto;
    this.geolocalizacaoMapa = this.data.geolocalizacao;
    this.geolocalizacaoMapa.lat = new Number(this.geolocalizacaoMapa.lat).valueOf();
    this.geolocalizacaoMapa.lng = new Number(this.geolocalizacaoMapa.lng).valueOf();
    this.partida = this.data.horaPartida;

    const departureTime = moment(moment(new Date()).add(1, 'days').format('L').toString() + ' ' + this.partida, 'DD/MM/YYYY HH:mm:ss').toDate();
    
    this.transitOptions = {
      departureTime: departureTime,
      modes: ['BUS']
    }
    this.drivingOptions = {
      departureTime: departureTime,
      trafficModel: "pessimistic"
    }
    if (this.data.trajeto)
    {//console.log(this.data.trajeto);
      this.carregarTrajeto();
    }
  }
  
  mapClicked(event) 
  {
    if (this.markers.length > 22)
    {
      this.snackBar.open(
        'Você atingiu o limite de 23 pontos/ajutes.', '', 
        {panelClass: ['snack-bar-error'], duration: 4500}
      );
    }
    else
    {
      if (!this.rotaVisivel)
      {
        const ordem = '' + (this.markers.length + 1);
        const id = uuid();
    
        this.markers.push({
          id: id,
          lat: event.coords.lat,
          lng: event.coords.lng,
          ordem: ordem,
          draggable: true,
          infoVisivel: true
        });
        this.form.addControl(id, new FormControl('', [Validators.required, ValidadorNomePonto.validateName]));
      }
    }
  }
  
  atualizarNomePonto(m: Marker, event)
  {
    const valorCampo: string = this.form.get(m.id).value;

    if (!valorCampo.startsWith(' ') && valorCampo !== '' || event.key === 'Backspace')
    {
      m.nome = this.form.get(m.id).value;
    }
  }

  removerMarcador(marker: Marker)
  {
    this.markers.splice(this.markers.indexOf(marker), 1)[0];
    this.form.removeControl(marker.id);

    if (this.tempoTotalTrajeto)
    {
      ManipuladorTempo.decrementarTempoTotalTrajeto(ManipuladorTempo.converterTempoTotalTrajetoParaSegundos(this.tempoTotalTrajeto));
    }
    // ATUALIZA LABELS(ORDEM) DENTRO DOS MARCADORES
    let cont = 0;

    for(let m of this.markers) 
    {
      cont++;

      m.ordem = '' + cont;
    }
  }

  markerDragEnd(marker: Marker, event) 
  {
    // ATUALIZAR LATITUDE / LONGITUDE
    marker.lat = event.coords.lat;
    marker.lng = event.coords.lng
  }

  // FAZ A LIGAÇÃO ENTRE OS MARCADORES/PONTOS DE PARADA GERANDO UM TRAJETO
  gerarTrajeto()
  {
    // SELECIONOU EDITAR TRAJETO. VOLTA PARA A TELA DE ADIÇÃO DE MARCADORES E EDIÇÃO DE NOME DE PONTOS
    if (this.rotaVisivel) 
    {
      this.markers[0].infoVisivel = false; // Ocultando infowindow da origem
      this.markers[this.markers.length - 1].infoVisivel = false; // Ocultando infowindow do destino
      
      // REMOVENDO PONTOS QUE NÃO SÃO DE PARADA
      for (let i = this.pontosParadaAtualizados.length - 1; i >= 0; i--)
      {
        if (!this.pontosParadaAtualizados[i].stopover)
        {
          this.pontosParadaAtualizados.splice(i, 1);
        }
      }
      // ATUALIZANDO MARCADORES
      for (let i = 0, cont = 1; i < this.pontosParadaAtualizados.length; i++, cont++)
      {
        let marker = this.markers[cont];

        if (this.pontosParadaAtualizados[i] !== null)
        {
          if (marker.nome !== '-')
          {
            marker.lat = this.pontosParadaAtualizados[i].location.location.lat();
            marker.lng = this.pontosParadaAtualizados[i].location.location.lng();
          }
          marker.infoVisivel = false;
        }
      }
      this.rotaVisivel = false;
    }
    // SELECIONOU GERAR TRAJETO. GERA O TRAJETO BASEADO NOS MARCADORES
    else
    {
      if (this.form.invalid)
      {
        this.snackBar.open(
          'Você esqueceu de nomear algum ponto de parada', '', 
          {panelClass: ['snack-bar-error'], duration: 4500}
        );
      }
      else
      { // Fazendo uma cópia do array
        const marcadores: Marker[] = JSON.parse(JSON.stringify(this.markers));
    
        const origem: Marker = marcadores.shift();
        const destino: Marker = marcadores.pop(); 
    
        this.origemRota = {lat: origem.lat, lng: origem.lng};
        this.destinoRota = {lat: destino.lat, lng: destino.lng};
    
        this.criarPontosParada(marcadores);
      }
    }
  }

  private criarPontosParada(marcadores: Marker[])
  {
    this.pontosParada = [];

    for (let m of marcadores)
    {
      const pontoParada: Waypoint = {
        location: {
          lat: m.lat, 
          lng: m.lng
        }, 
        stopover: true
      };
      this.pontosParada.push(pontoParada);
    }
    this.rotaVisivel = true;
  }

  // ATUALIZA LOCALIZAÇÃO DOS PONTOS DE PARADA QUANDO UM DOS MARCADORES É MOVIMENTADO
  onChange(event)
  {
    // ATUALIZANDO ORIGEM
    if (event.request.origin.location)
    {
      this.markers[0].lat = event.request.origin.location.lat();
      this.markers[0].lng = event.request.origin.location.lng();
    }
    else
    {
      this.markers[0].lat = event.request.origin.lat();
      this.markers[0].lng = event.request.origin.lng();
    }

    // ATUALIZANDO DESTINO
    if (event.request.destination.location)
    {
      this.markers[this.markers.length - 1].lat = event.request.destination.location.lat();
      this.markers[this.markers.length - 1].lng = event.request.destination.location.lng();
    }
    else
    {
      this.markers[this.markers.length - 1].lat = event.request.destination.lat();
      this.markers[this.markers.length - 1].lng = event.request.destination.lng();
    }
    // ATUALIZANDO PONTOS
    this.pontosParadaAtualizados = event.request.waypoints; 
    // console.log(event.request.waypoints);

    // ATUALIZA DISTANCIA, TEMPO DE VIAGEM E HORA DE CHEGADA
    this.atualizarInformacoesTrajeto(event);
  }

  // CHAMADO QUANDO UMA RESPOSTA É RECEBIDA
  // event doc https://developers.google.com/maps/documentation/directions/intro#DirectionsResponses
  private atualizarInformacoesTrajeto(event)
  {
    const legs: any[] = event.routes[0].legs;

    let metros: number = 0;
    let segundos: number = 0;

    for (let leg of legs)
    {
      metros += leg.distance.value;
      segundos += leg.duration.value;
    }
    const quilometros = metros / 1000;

    this.tempoTotalTrajeto = ManipuladorTempo.formatarHorarioTrajeto(ManipuladorTempo.incrementarTempoTotalTrajeto(this.markers.length, segundos));
    this.distancia = Number.parseFloat(quilometros.toFixed(1));
    this.chegada = ManipuladorTempo.calcularHoraChegada(this.partida, this.tempoTotalTrajeto);
  }

  private criarInstanciaTrajeto(): Trajeto
  {
    const trajeto = new Trajeto();
    trajeto.tipo = [TIPO_TRAJETO.IDA, TIPO_TRAJETO.VOLTA].filter(tipo => tipo === this.tipoTrajeto)[0];
    
    const horarioTrajeto = new HorarioTrajeto();
    horarioTrajeto.partida = this.partida;
    horarioTrajeto.chegada = this.chegada;
    
    trajeto.horarioTrajeto = horarioTrajeto;
    
    return trajeto;
  }

  private criarInstanciaOrigem(): PontoParada
  {
    // buscando origem/primeiro ponto
    const primeiroMarcador: Marker = this.markers.filter(marker => marker.ordem === '1')[0];

    // adicionando primeiro ponto
    const origem: PontoParada = new PontoParada();
    origem.nome = primeiroMarcador.nome;
    origem.ordem = Number.parseInt(primeiroMarcador.ordem);

    const geolocalizacaoOrigem = new Geolocalizacao();
    geolocalizacaoOrigem.lat = primeiroMarcador.lat;
    geolocalizacaoOrigem.lng = primeiroMarcador.lng;

    origem.geolocalizacao = geolocalizacaoOrigem;

    return origem;
  }

  // Último ponto de parada adicionado
  private criarInstanciaDestino(): PontoParada
  {
    // buscando destino/último ponto
    // const ultimoMarcador: Marker = this.markers.filter(marker =>
    //   Number.parseInt(marker.ordem) === (this.markers.length))[0];
    const ultimoMarcador: Marker = this.markers[this.markers.length - 1];

    // adicionando último ponto
    const destino: PontoParada = new PontoParada();
    destino.nome = ultimoMarcador.nome;
    destino.ordem = this.pontosParadaAtualizados.length + 2; // +1 da origem e +1 do destino

    const geolocalizacaoDestino = new Geolocalizacao();
    geolocalizacaoDestino.lat = ultimoMarcador.lat;
    geolocalizacaoDestino.lng = ultimoMarcador.lng;

    destino.geolocalizacao = geolocalizacaoDestino;

    return destino;
  }

  exibirAjuda()
  {
    this.ajudaVisivel = !this.ajudaVisivel;
  }

  criarFormulario()
  {
    this.form = this.formBuilder.group({});
  }

  salvar()
  {
    let trajeto: Trajeto = this.criarInstanciaTrajeto();
    
    if (this.data.trajeto)
    {
      trajeto.id = this.data.trajeto.id;
      trajeto.horarioTrajeto.id = this.data.trajeto.horarioTrajeto.id;
      trajeto.descricao = this.data.trajeto.descricao;
      trajeto.ativado = this.data.trajeto.ativado;
    }
    // else
    // {
    //   trajeto.horarioTrajeto.id = this.data.horarioTrajetoId;
    // }
    const pontosParada: PontoParada[] = [];

    let origem: PontoParada = this.criarInstanciaOrigem();

    pontosParada.push(origem);

    try
    {
      // adicionando pontos de parada intermediários
      for (let i=0, j=1, ordem=2; i < this.pontosParadaAtualizados.length; i++, ordem++)
      {
        let pontoParada = new PontoParada();
        pontoParada.geolocalizacao = new Geolocalizacao();

        // Não é um ponto de parada
        if (!this.pontosParadaAtualizados[i].stopover)
        {
          pontoParada.nome = '-';
          pontoParada.geolocalizacao.lat = this.pontosParadaAtualizados[i].location.lat();
          pontoParada.geolocalizacao.lng = this.pontosParadaAtualizados[i].location.lng();
        }
        else
        {
          pontoParada.nome = this.markers[j].nome;
          pontoParada.geolocalizacao.lat = this.pontosParadaAtualizados[i].location.location.lat();
          pontoParada.geolocalizacao.lng = this.pontosParadaAtualizados[i].location.location.lng();
          j++;
        }
        pontoParada.ordem = ordem;
        pontosParada.push(pontoParada);
      }
      let destino: PontoParada = this.criarInstanciaDestino();

      pontosParada.push(destino);

      trajeto.pontosParada = pontosParada;

      this.dialogRef.close(trajeto);// any value parameter
    }
    catch(erro)
    {
      console.log(erro);
      const snackBarRef = this.snackBar
        .open('Ops, um erro ocorreu. Talvez você tenha adicionado muitos ajustes ao trajeto. ' +
            'Aperte RECARREGAR e se necessário, refaça apenas os ajustes essenciais.', 
            'RECARREGAR', {panelClass: ['snack-bar-error'], duration: 60000}
      );
      snackBarRef.onAction().subscribe(() => {
        const marcadores: Marker[] = JSON.parse(JSON.stringify(this.markers));
    
        const origem: Marker = marcadores.shift();
        const destino: Marker = marcadores.pop(); 
    
        this.origemRota = {lat: origem.lat, lng: origem.lng};
        this.destinoRota = {lat: destino.lat, lng: destino.lng};
    
        this.criarPontosParada(marcadores);
      });
    }
  }

  // EDIÇÃO DE ROTA
  private carregarTrajeto()
  {
    const pontosParada: PontoParada[] = JSON.parse(JSON.stringify(this.data.trajeto.pontosParada));
        
    const destino: PontoParada = pontosParada.pop(); 
    const origem: PontoParada = pontosParada.shift();

    this.origemRota = {lat: Number.parseFloat(origem.geolocalizacao.lat), lng: Number.parseFloat(origem.geolocalizacao.lng)};
    this.destinoRota = {lat: Number.parseFloat(destino.geolocalizacao.lat), lng: Number.parseFloat(destino.geolocalizacao.lng)};

    // adicionando origem
    const idCampoOrigem = uuid();
    this.form.addControl(idCampoOrigem, new FormControl(origem.nome, Validators.required));

    this.markers.push({
      id: idCampoOrigem,
      lat: Number.parseFloat(origem.geolocalizacao.lat),
      lng: Number.parseFloat(origem.geolocalizacao.lng),
      ordem: origem.ordem.toString(),
      draggable: true,
      infoVisivel: false,
      nome: origem.nome
    });
    let contador = 2;

    for (let p of pontosParada)
    {
      const pontoParada: Waypoint = {
        location: {
          lat: Number.parseFloat(p.geolocalizacao.lat), 
          lng: Number.parseFloat(p.geolocalizacao.lng)
        }, 
        stopover: p.nome !== '-'
      };
      this.pontosParada.push(pontoParada);

      if (p.nome !== '-')
      {
        const id = uuid();
        this.form.addControl(id, new FormControl(p.nome, [Validators.required, ValidadorNomePonto.validateName]));
  
        this.markers.push({
          id: id,
          lat: Number.parseFloat(p.geolocalizacao.lat),
          lng: Number.parseFloat(p.geolocalizacao.lng),
          ordem: contador.toString(),
          draggable: true,
          infoVisivel: false,
          nome: p.nome
        });
        contador++;
      }
    }
    // adicionando destino
    const idCampoDestino = uuid();
    this.form.addControl(idCampoDestino, new FormControl(destino.nome, Validators.required));

    this.markers.push({
      id: idCampoDestino,
      lat: Number.parseFloat(destino.geolocalizacao.lat),
      lng: Number.parseFloat(destino.geolocalizacao.lng),
      ordem: (contador++).toString(),
      draggable: true,
      infoVisivel: false,
      nome: destino.nome
    });
    this.rotaVisivel = true;
  }
}


@Component({
  selector: 'app-ajuda-rota-dialog',
  templateUrl: './../../../comum/ajuda-dialog/ajuda-dialog.component.html',
  styleUrls: [ './../../../comum/ajuda-dialog/ajuda-dialog.component.css']
})
export class AjudaRotaDialogComponent extends AjudaDialog
{
  carregarTextoAjuda()
  {
    if (this.tipoAjuda === 'trajetoIda')
    {
      this.textoTitulo = 'Trajeto de ida'

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> ABRIR MAPA </strong> para adicionar ou editar os pontos de parada ' +
        'onde os alunos deverão <strong>esperar</strong> o veículo estudantil, na viagem de <strong>ida</strong> para a instituição de ensino. </p> ');
    }
    else if (this.tipoAjuda === 'trajetoVolta')
    {
      this.textoTitulo = 'Trajeto de volta';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> ABRIR MAPA </strong> para adicionar ou editar os pontos de parada ' + 
        'onde os alunos poderão <strong>descer</strong> quando o veículo estudantil <strong>voltar</strong> ao município de origem. </p> ');
    }
    else if (this.tipoAjuda === 'verMapaIda')
    {
      this.textoTitulo = 'Trajeto de ida';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> ABRIR MAPA </strong> para adicionar ou editar os pontos de parada ' +
        'onde os alunos deverão <strong>esperar</strong> o veículo estudantil, na viagem de <strong>ida</strong> para a instituição de ensino. </p> ');
    }
    else if (this.tipoAjuda === 'verMapaIda')
    {
      this.textoTitulo = 'Trajeto de volta';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> ABRIR MAPA </strong> para adicionar ou editar os pontos de parada ' + 
        'onde os alunos poderão <strong>descer</strong> quando o veículo estudantil <strong>voltar</strong> ao município de origem. </p> ');
    }
  }
}


@Component({
  selector: 'app-trajeto-listagem-dialog',
  templateUrl: 'trajeto-listagem-dialog/trajeto-listagem-dialog.component.html',
  styleUrls: [ 'trajeto-listagem-dialog/trajeto-listagem-dialog.component.css']
})
export class TrajetoListagemDialogComponent implements OnInit
{
  trajetos: Array<Trajeto>;
  tipo: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data, 
      private dialogRef: MatDialogRef<TrajetoListagemDialogComponent>)
  {
    this.trajetos = data.trajetos;
    this.tipo = data.tipoTrajeto
  }

  ngOnInit() {}

  atualizarTrajetoEscolhido(trajeto: Trajeto)
  {
    this.dialogRef.close(trajeto);
  }
}


@Component({
  selector: 'app-confirmacao-dialog',
  templateUrl: './../../../comum/confirmacao-dialog/confirmacao-dialog.component.html',
  styleUrls: [ './../../../comum/confirmacao-dialog/confirmacao-dialog.component.css' ]
})
export class ConfirmacaoExclusaoTrajetoDialogComponent extends ConfirmacaoDialog 
{
  constructor(protected dialogRef: MatDialogRef<ConfirmacaoExclusaoTrajetoDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data: any, protected sanitizer: DomSanitizer)
  {
    super();

    this.carregarTextos();
  }

  carregarTextos()
  {
    this.textoBotaoConfirmar = 'EXCLUIR';
    this.textoBotaoCancelar = 'VOLTAR';
    this.textoTitulo = 'Confirmação de exclusão de trajeto';
    this.textoConfirmacao = this.sanitizer.bypassSecurityTrustHtml('<p> Você está excluindo o trajeto: </p>' +
    '<p> <strong>' + this.data.trajeto.descricao + '</strong> </p> ' +
    '<p> Se você confirma a exclusão, aperte <strong> EXCLUIR </strong> </p>');
  }

  confirmar()
  {
    this.dialogRef.close(true);
  }
}


export interface Marker {
  id: string;
	lat: number;
	lng: number;
  ordem?: string; // label
  nome?: string;
  draggable: boolean;
  infoVisivel?: boolean;
}

export interface Waypoint {
  location: Location;
  stopover: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface MarkerOption {
  origin: any;
  destination: any;
  waypoints: any[];
}





/*
export interface leg
{
  "distance" : {
    "text" : "35.9 mi",
    "value" : 57824 ----> METROS
  },
  "duration" : {
    "text" : "51 mins",
    "value" : 3062 ---->  SEGUNDOS
  },
  "end_address" : "Universal Studios Blvd, Los Angeles, CA 90068, USA",
  "end_location" : {
    "lat" : 34.1330949,
    "lng" : -118.3524442
  },
  "start_address" : "Disneyland (Harbor Blvd.), S Harbor Blvd, Anaheim, CA 92802, USA",
  "start_location" : {
    "lat" : 33.8098177,
    "lng" : -117.9154353
  }
}
*/