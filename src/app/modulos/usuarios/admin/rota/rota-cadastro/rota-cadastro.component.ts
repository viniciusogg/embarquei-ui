import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { InstituicaoEnsino, Rota, Cidade, Motorista, Trajeto, TIPO_TRAJETO, PontoParada, Geolocalizacao, HorarioTrajeto } from './../../../../../modulos/core/model';

import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { CidadeService } from './../../../../../services/cidade.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';
import { AdminService } from './../../../../../services/admin.service';
import { RotaService } from './../../../../../services/rota.service';

import { AjudaDialog } from '../../../comum/ajuda-dialog/ajuda-dialog';
import { ManipuladorTempo } from './../../../comum/manipulador-tempo';
import { ValidadorHora } from '../../../comum/validadores-personalizados/validador-hora';
import { ValidadorNomePonto } from '../../../comum/validadores-personalizados/validador-nome-ponto';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.css']
})
export class RotaCadastroComponent implements OnInit 
{
  rotaForm: FormGroup;
  trajetoIda: Trajeto;
  trajetoVolta: Trajeto;
  rota: Rota;
  isMobile = false;
  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  instituicaoEnsino: InstituicaoEnsino;
  instituicoesEnsino = new Array<InstituicaoEnsino>();
  desabilitarCampoBotaoInstituicoes = true;

  public mascaraHora = [/\d/, /\d/, ':', /\d/, /\d/];

  constructor(private storageDataService: StorageDataService, private cidadeService: CidadeService,
    private breakpointObserver: BreakpointObserver, private instituicaoEnsinoService: InstituicaoEnsinoService,
    private errorHandlerService: ErrorHandlerService, private dialog: MatDialog, private formBuilder: FormBuilder,
    private adminService: AdminService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    private rotaService: RotaService, private router: Router) 
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

        this.trajetoIda = this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA)[0];
        this.trajetoIda.pontosParada = this.ordenarPontos(this.trajetoIda.pontosParada);

        this.trajetoVolta = this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA)[0];
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

  abrirMapa(tipoTrajeto: string)
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;
    
    let trajeto: Trajeto;
    let horaPartida: any = tipoTrajeto === TIPO_TRAJETO.IDA ? 
        this.rotaForm.get('campoHorarioPartidaIda').value : 
        this.rotaForm.get('campoHorarioPartidaVolta').value;
    let geolocalizacao: any = tipoTrajeto === TIPO_TRAJETO.IDA ? usuarioLogado.endereco.cidade.geolocalizacao : 
        this.trajetoIda.pontosParada[this.trajetoIda.pontosParada.length - 1].geolocalizacao;

    if (this.rota)
    {
      trajeto = tipoTrajeto === TIPO_TRAJETO.IDA ? 
          this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.IDA)[0] :
          this.rota.trajetos.filter(trajeto => trajeto.tipo === TIPO_TRAJETO.VOLTA)[0];
    }
    const dialogRef = this.dialog.open(MapaDialogComponent, {
      height: '95%',
      width: '99%',
      id: 'mapa-dialog',
      maxWidth: '96vw',
      disableClose: true,
      data: {
        tipoTrajeto: tipoTrajeto,
        trajeto: trajeto,
        horaPartida: horaPartida,
        geolocalizacao: geolocalizacao
      }
    });
    dialogRef.afterClosed()
      .toPromise()
      .then(result => //{ .subscribe(result =>
      {
        if (result)
        {
          console.log(result);
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

  private criarRota(): Rota
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;

    const trajetos: Trajeto[] = new Array<Trajeto>();
    trajetos.push(this.trajetoIda);
    trajetos.push(this.trajetoVolta);

    const rota = new Rota();
    rota.cidade = usuarioLogado.endereco.cidade;
    // rota.nome = this.rotaForm.get('campoNomeRota').value;
    rota.instituicoesEnsino = this.dataSourceInstituicoes.data;
    rota.trajetos = trajetos;

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
    const rota: Rota = this.criarRota();
    rota.id = this.rota.id;

    return this.rotaService.atualizar(rota)
      .then(response => 
      {
        this.snackBar.open('Atualizada com sucesso', '', { duration: 3500 });

        return response;
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
      // label: {
      //   text: ' ',
      //   color: 'white',
      //   fontWeight: 'bold',
      //   fontFamily: 'sans-serif'
      // },
      icon: {
        // labelOrigin: {x: 13, y: 14},
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
    {
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

    ManipuladorTempo.decrementarTempoTotalTrajeto(ManipuladorTempo.converterTempoTotalTrajetoParaSegundos(this.tempoTotalTrajeto));

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
    }
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

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> VER MAPA </strong> para visualizar ou editar os pontos de parada ' +
        'onde os alunos deverão <strong>esperar</strong> o veículo estudantil, na viagem de <strong>ida</strong> para a instituição de ensino. </p> ' + 
        '<p> Aperte <strong> TROCAR </strong> para substituir o trajeto de ida atual por outro previamente cadastrado nesta rota. </p>');
    }
    else if (this.tipoAjuda === 'trajetoVolta')
    {
      this.textoTitulo = 'Trajeto de volta';

      this.textoAjuda = this.sanitizer.bypassSecurityTrustHtml('<p> Aperte <strong> VER MAPA </strong> para visualizar ou editar os pontos de parada ' + 
        'onde os alunos poderão <strong>descer</strong> quando o veículo estudantil <strong>voltar</strong> ao município de origem. </p> ' +
        '<p> Aperte <strong> TROCAR </strong> para substituir o trajeto de volta atual por outro previamente cadastrado nesta rota. </p>');
    }
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