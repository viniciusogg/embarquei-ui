import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.component.html',
  styleUrls: ['./sos.component.css']
})
export class SosComponent implements OnInit {
  sos: any = [
    {
      url: 'url(assets/samu-logotipo.png)',
      nome: 'Samu',
      numero: '192'
    },
    {
      url: 'url(assets/bombeiros-logotipo.png)',
      nome: 'Bombeiros',
      numero: '193'
    },
    {
      url: 'url(assets/policia-militar-logotipo.png)',
      nome: 'Polícia militar',
      numero: '190'
    }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
