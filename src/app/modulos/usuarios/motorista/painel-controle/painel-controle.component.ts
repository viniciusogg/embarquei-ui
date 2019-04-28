import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-painel-controle',
  templateUrl: './painel-controle.component.html',
  styleUrls: ['./painel-controle.component.css']
})
export class PainelControleComponent implements OnInit {

  constructor(private storageDataService: StorageDataService) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Painel de controle';
    });
  }

}
