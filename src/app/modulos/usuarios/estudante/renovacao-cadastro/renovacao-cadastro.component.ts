import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-renovacao-cadastro',
  templateUrl: './renovacao-cadastro.component.html',
  styleUrls: ['./renovacao-cadastro.component.css']
})
export class RenovacaoCadastroComponent implements OnInit {

  constructor(private storageDataService: StorageDataService) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Renovação de cadastro';
    })
  }

}
