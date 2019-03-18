import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { StorageDataService } from './../../../../../services/storage-data.service';
import { InstituicaoEnsino } from './../../../../../modulos/core/model';
import { InstituicaoEnsinoService } from './../../../../../services/instituicao-ensino.service';
import { ErrorHandlerService } from './../../../../../modulos/core/error-handler.service';

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

  abrirMapa()
  {
    this.dialog.open(MapaDialogComponent, {
      height: '95%',
      width: '99%',
      id: 'mapa-dialog',
      maxWidth: '96vw',
      data: {
        
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
  origem: any = {lat: -8.069827101202105, lng: -37.268838007335034};
  
  pontosParada: any[] =
  [
    {location: {lat: -8.071965022877071, lng: -37.266019953147406}, stopover: true},
    {location: {lat: -8.075388283174085, lng: -37.265974192669546}, stopover: true},
    {location: {lat: -8.077649280753182, lng: -37.265848917398785}, stopover: true},
    {location: {lat: -8.069859929768327, lng: -37.26057685795638}, stopover: true}
  ];
  destino: any = {lat: -7.90507294536003, lng: -37.12034539147555};  
  zoom: number = 15;
  ajudaVisivel = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}

  // onChoseLocation(event) 
  // {
  //   console.log(event);
  // }

  // onDragEndMarker(event)
  // {
  //   console.log(event);
  // }

  // onClikMarker(event)
  // {
  //   console.log(event);
  // }
  // google maps zoom level

  clickedMarker(label: string, index: number) 
  {
    // 
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked(event) 
  {
    let contador = this.markers.length + 1;

    this.markers.push({
      lat: event.coords.lat,
      lng: event.coords.lng,
      label: '' + contador,
      draggable: true
    });
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) 
  {
    // ATUALIZAR LATITUDE / LONGITUDE
    // console.log('dragEnd', m, $event);
  }
  
  exibirAjuda()
  {
    this.ajudaVisivel = !this.ajudaVisivel;
  }

  markers: marker[] = [
    // {
    //   lat: this.origem.lat, 
    //   lng: this.origem.lng,
		//   label: 'A',
		//   draggable: true
	  // },
	  // {
    //   lat: -8.071965022877071, 
    //   lng: -37.266019953147406,
		//   label: 'B',
		//   draggable: true
	  // },
	  // {
    //   lat: -8.075388283174085, 
    //   lng: -37.265974192669546,
		//   label: 'C',
		//   draggable: true
	  // },
	  // {
    //   lat: -8.077649280753182, 
    //   lng: -37.265848917398785,
		//   label: 'D',
		//   draggable: true
	  // }
  ]

}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
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
