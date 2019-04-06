import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dados-trajeto',
  templateUrl: './dados-trajeto.component.html',
  styleUrls: ['./dados-trajeto.component.css']
})
export class DadosTrajetoComponent
{
  @Input() public distancia: number;
  @Input() public tempoTotalTrajeto: string;
  @Input() public partida: string;
  @Input() public chegada: string;

  ajudaVisivel = false;

  exibirAjuda()
  {
    this.ajudaVisivel = !this.ajudaVisivel;
  }

  constructor() { }
}
