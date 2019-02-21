import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageDataService } from './../../../../services/storage-data.service';
import { VeiculoTransporteService } from './../../../../services/veiculo-transporte.service';
import { VeiculoTransporte } from './../../../../modulos/core/model';
import { UploadService } from './../../../../services/upload.service';
import { ErrorHandlerService } from './../../../../modulos/core/error-handler.service';

@Component({
  selector: 'app-detalhes-veiculo',
  templateUrl: './detalhes-veiculo.component.html',
  styleUrls: ['./detalhes-veiculo.component.css']
})
export class DetalhesVeiculoComponent implements OnInit 
{
  placa = 'abc-123'
  tipo = 'Onibus'
  capacidade = '100'
  cor = 'Vermelho'

  veiculoTransporte: VeiculoTransporte;

  constructor(private storageDataService: StorageDataService, private activatedRoute: ActivatedRoute,
     private veiculoTransporteService: VeiculoTransporteService, private uploadService: UploadService,
     private errorHandlerService: ErrorHandlerService) 
  {}

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Detalhes do veículo';
    })
    const idVeiculo = this.activatedRoute.snapshot.params['id'];

    this.veiculoTransporteService.getById(idVeiculo)
      .then((response) => {
        this.veiculoTransporte = response;
        this.uploadService.getFile(response.imagem.caminhoSistemaArquivos)
          .toPromise()
          .then((link) => {
            this.veiculoTransporte.linkFoto = link;
          })
          .catch(erro => this.errorHandlerService.handle(erro));
      })
      .catch(erro => this.errorHandlerService.handle(erro));
  }
}
