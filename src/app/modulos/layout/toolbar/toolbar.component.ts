import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';

import { StorageDataService } from './../../../services/storage-data.service';
import { LembreteDialogComponent } from './../../usuarios/estudante/checkin/checkin.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  fotoUsuario: string;

  isAutenticado;

  constructor(private dialog: MatDialog, private router: Router, private storageDataService: StorageDataService) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ocultarToolbar() 
  {
    return !this.isTelaLogin();
  }

  ocultarMenu()
  {
    this.isAutenticado = true;

    const token = localStorage.getItem('embarquei-token');

    if (token === undefined || token === null)
    {
      this.isAutenticado = false;
    }
    return this.router.url !== '/cadastro/estudante' && !this.isTelaLogin()
      && this.isAutenticado;
  }

  isTelaLogin() 
  {
    return this.router.url === '/login';
  }

  alterarBackground() {
    if (this.isTelaLogin()) 
    {
      return '#2979FF';
    }
    return 'unset';
  }

  abrirLembreteDialog()
  {
    this.dialog.open(LembreteDialogComponent, {
      height: '90%', width: '99%'//,
    });
  }
}
