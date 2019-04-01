import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { InstituicaoEnsino, Rota, Cidade, Motorista, Trajeto, TIPO_TRAJETO, PontoParada, Geolocalizacao } from './../../../../../modulos/core/model';
import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';
import { CidadeService } from './../../../../../services/cidade.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';
import { v4 as uuid } from 'uuid';
import { AdminService } from './../../../../../services/admin.service';

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
  isMobile = false;
  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  instituicaoEnsino = '';
  instituicoesEnsino = new Array<any>();
  desabilitarCampoBotaoInstituicoes = true;

  //   public mascaraHora = [/\d/, /\d/, ':', /\d/, /\d/];

  constructor(private storageDataService: StorageDataService, private cidadeService: CidadeService,
    private breakpointObserver: BreakpointObserver, private instituicaoEnsinoService: InstituicaoEnsinoService,
    private errorHandlerService: ErrorHandlerService, private dialog: MatDialog, private formBuilder: FormBuilder,
    private adminService: AdminService) 
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
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Cadastro de rota';
    });
    this.criarFormulario();
    
    if (localStorage.getItem('tipoUsuarioLogado') === 'admin')
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
    else 
    {
      // MOTORISTA
    }

  }

  private criarFormulario()
  {
    this.rotaForm = this.formBuilder.group({
      campoNomeRota: [null, Validators.required],
      campoHorarioPartidaIda: [null, Validators.required, Validators.minLength(5), ValidateHour, Validators.maxLength(5)],
      campoHorarioPartidaVolta: [null, Validators.required, Validators.minLength(5), ValidateHour, Validators.maxLength(5)],
      campoInstituicao: [null]
    });
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

  abrirMapa(tipoTrajeto: string)
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;

    const dialogRef = this.dialog.open(MapaDialogComponent, {
      height: '95%',
      width: '99%',
      id: 'mapa-dialog',
      maxWidth: '96vw',
      disableClose: true,
      data: {
        tipoTrajeto: tipoTrajeto,
        cidade: usuarioLogado.endereco ? 
            usuarioLogado.endereco.cidade : (usuarioLogado as Motorista).cidade
      }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      this.adicionarHorariosTrajeto(result);
    });
  }

  private adicionarHorariosTrajeto(trajeto)
  {
    if (trajeto.tipo === TIPO_TRAJETO.IDA)
    {
      this.trajetoIda = trajeto;
      this.trajetoIda.horarioTrajeto.partida = this.rotaForm.get('campoHorarioPartidaIda').value;
      // FALTA IMPLEMENTAR O CÁLCULO DE TEMPO DO TRAJETO, DA ORIGEM AO DESTINO, 
      // LEVANDO EM CONTA OS PONTOS DE PARADA
      // this.trajetoIda.horarioTrajeto.chegada = this.rotaService.calcularTempo(trajeto);
    }
    else if (trajeto.tipo === TIPO_TRAJETO.VOLTA)
    {
      this.trajetoVolta = trajeto;
      this.trajetoVolta.horarioTrajeto.partida = this.rotaForm.get('campoHorarioPartidaVolta').value;
      // FALTA IMPLEMENTAR O CÁLCULO DE TEMPO DO TRAJETO, DA ORIGEM AO DESTINO, 
      // LEVANDO EM CONTA OS PONTOS DE PARADA
      // this.trajetoVolta.horarioTrajeto.chegada = this.rotaService.calcularTempo(trajeto);
    }
  }

  private criarRota(): Rota
  {
    const usuarioLogado = this.storageDataService.usuarioLogado;

    const trajetos: Trajeto[] = new Array<Trajeto>();
    trajetos.push(this.trajetoIda);
    trajetos.push(this.trajetoVolta);

    const rota = new Rota();
    rota.cidade = usuarioLogado.endereco ? 
        usuarioLogado.endereco.cidade : (usuarioLogado as Motorista).cidade;
    rota.nome = this.rotaForm.get('campoNomeRota').value;
    rota.instituicoesEnsino = this.dataSourceInstituicoes.data;
    rota.trajetos = trajetos;

    return rota;
  }

  salvar()
  {
    const rota: Rota = this.criarRota();


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

  // AGM MAP
  cidade: Cidade;
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
      private snackBar: MatSnackBar, private dialogRef: MatDialogRef<MapaDialogComponent>) 
  {
    this.tipoTrajeto = data.tipoTrajeto;
    this.cidade = data.cidade;
    this.cidade.geolocalizacao.lat = new Number(this.cidade.geolocalizacao.lat).valueOf();
    this.cidade.geolocalizacao.lng = new Number(this.cidade.geolocalizacao.lng).valueOf();
    // console.log(data.cidade);
  }

  ngOnInit() 
  {
    this.criarFormulario();
  }
  
  mapClicked(event) 
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
      this.form.addControl(id, new FormControl('', Validators.required));
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
      this.rotaVisivel = false;

      this.markers[0].infoVisivel = false; // Ocultando infowindow da origem
      this.markers[this.markers.length - 1].infoVisivel = false; // Ocultando infowindow do destino

      let cont = 2; // DESCONSIDERA A ORIGEM

      // REMOVENDO PONTOS QUE NÃO SÃO DE PARADA
      for (let ponto of this.pontosParadaAtualizados)
      {
        if (!ponto.stopover)
        {
          let indice = this.pontosParadaAtualizados.indexOf(ponto);
          this.pontosParadaAtualizados.splice(indice, 1);
        }
      }
      // ATUALIZANDO MARCADORES
      for (let ponto of this.pontosParadaAtualizados)
      {
        if (ponto.location.location)
        {
          let marker = this.markers.filter(m => Number.parseInt(m.ordem) === cont)[0];

          marker.lat = ponto.location.location.lat();
          marker.lng = ponto.location.location.lng();
          marker.infoVisivel = false;
        }
        cont++;
      }
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
      {
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
  }

  salvar()
  {
    const trajeto = new Trajeto();
    trajeto.tipo = [TIPO_TRAJETO.IDA, TIPO_TRAJETO.VOLTA].filter(tipo => tipo === this.tipoTrajeto)[0];

    const pontosParada: PontoParada[] = [];

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
    origem.trajeto = trajeto;

    pontosParada.push(origem);

    // adicionando pontos de parada intermediários
    for (let i=0, j=0, ordem=2; i < this.pontosParadaAtualizados.length; i++, ordem++)
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
      pontoParada.trajeto = trajeto;
    }
    // buscando destino/último ponto
    const ultimoMarcador: Marker = this.markers.filter(marker =>
       Number.parseInt(marker.ordem) === (this.markers.length))[0];

    // adicionando último ponto
    const destino: PontoParada = new PontoParada();
    destino.nome = ultimoMarcador.nome;
    destino.ordem = Number.parseInt(ultimoMarcador.ordem);

    const geolocalizacaoDestino = new Geolocalizacao();
    geolocalizacaoDestino.lat = ultimoMarcador.lat;
    geolocalizacaoDestino.lng = ultimoMarcador.lng;

    destino.geolocalizacao = geolocalizacaoDestino;
    destino.trajeto = trajeto;

    pontosParada.push(destino);

    trajeto.pontosParada = pontosParada;

    this.dialogRef.close(trajeto);// any value parameter
  }

  exibirAjuda()
  {
    this.ajudaVisivel = !this.ajudaVisivel;
  }

  criarFormulario()
  {
    this.form = this.formBuilder.group({});
  }
}

export class Marker {
  id: string;
	lat: number;
	lng: number;
  ordem?: string; // label
  nome?: string;
  draggable: boolean;
  infoVisivel?: boolean;
}

export class Waypoint {
  location: Location;
  stopover: boolean;
}

export class Location {
  lat: number;
  lng: number;
}

export class MarkerOption {
  origin: any;
  destination: any;
  waypoints: any[] = [];
}

export function ValidateHour(control: AbstractControl)
{
  const valorCampoHora = control.value;

  const time = valorCampoHora.split(':');

  const hour: number = time[0];
  const minutes: number = time[1];

  if (hour > 23) {
    return { validHour: true};
  }
  if (minutes > 59){
    return { validHour: true};
  }
  return null;
}
