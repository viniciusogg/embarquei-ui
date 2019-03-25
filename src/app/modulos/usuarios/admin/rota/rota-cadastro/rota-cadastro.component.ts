import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { InstituicaoEnsino } from './../../../../../modulos/core/model';
import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';
import { v4 as uuid } from 'uuid';
import { InfoWindow } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.css']
})
export class RotaCadastroComponent implements OnInit {

  rotaForm: FormGroup;
  isMobile = false;
  dataSourceInstituicoes: MatTableDataSource<InstituicaoEnsino> = new MatTableDataSource();
  displayedColumns = ['nome', 'acoes'];

  instituicaoEnsino = '';
  instituicoesEnsino = new Array<any>();
  desabilitarCampoBotaoInstituicoes = true;

  //   public mascaraHora = [/\d/, /\d/, ':', /\d/, /\d/];

  constructor(private storageDataService: StorageDataService, private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver, private instituicaoEnsinoService: InstituicaoEnsinoService,
    private errorHandlerService: ErrorHandlerService, private dialog: MatDialog) 
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
  }

  criarFormulario()
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
    this.dialog.open(MapaDialogComponent, {
      height: '95%',
      width: '99%',
      id: 'mapa-dialog',
      maxWidth: '96vw',
      disableClose: true,
      data: {
        tipoTrajeto: tipoTrajeto
      }
    });
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
  cidade: any = {lat: -8.069827101202105, lng: -37.268838007335034}; // CIDADE
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) 
  {
    this.tipoTrajeto = data.tipoTrajeto;
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

  gerarTrajeto()
  {
    if (this.rotaVisivel) // EDITAR TRAJETO
    {
      this.rotaVisivel = false;

      this.markers[0].infoVisivel = false;
      this.markers[this.markers.length - 1].infoVisivel = false;

      let cont = 2; // DESCONSIDERA A ORIGEM

      // REMOVENDO PONTOS QUE NÃO SÃO DE PARADA
      for (let ponto of this.pontosParadaAtualizados)
      {
        if (!ponto.stepover)
        {
          let indice = this.pontosParadaAtualizados.indexOf(ponto);
          this.pontosParadaAtualizados.splice(indice, 1);
        }
      }
      
      for (let ponto of this.pontosParadaAtualizados)
      {
        if (ponto.location.location)
        {
          let marker = this.markers.filter(m => Number.parseInt(m.ordem) === cont)[0];

          marker.lat = ponto.location.location.lat();
          marker.lng = ponto.location.location.lng();
          marker.infoVisivel = false;

          // this.form.get(marker.id).setValue(marker.nome);
        }
        cont++;
      }
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

  // ATUALIZA LOCALIZAÇÃO DOS PONTOS DE PARADA
  onChange(event)
  {
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
    this.pontosParadaAtualizados = event.request.waypoints;
  }

  salvar()
  {
    if (this.pontosParadaAtualizados)
    {

    }
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
