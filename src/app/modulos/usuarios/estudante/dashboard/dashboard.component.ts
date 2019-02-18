import { Component, OnInit } from '@angular/core';
import { StorageDataService } from './../../../../services/storage-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private storageDataService: StorageDataService) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.storageDataService.tituloBarraSuperior = 'Resumo diário';
    });
  }

}
