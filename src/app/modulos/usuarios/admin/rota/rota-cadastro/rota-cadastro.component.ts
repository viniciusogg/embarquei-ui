import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './../../../../../services/storage-data.service';

@Component({
  selector: 'app-rota-cadastro',
  templateUrl: './rota-cadastro.component.html',
  styleUrls: ['./rota-cadastro.component.css']
})
export class RotaCadastroComponent implements OnInit {

  constructor(private storageDataService: StorageDataService) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Cadastro de rota';
    })
  }

}
