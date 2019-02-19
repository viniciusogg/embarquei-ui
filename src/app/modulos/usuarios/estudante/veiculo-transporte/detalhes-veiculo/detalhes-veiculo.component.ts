import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalhes-veiculo',
  templateUrl: './detalhes-veiculo.component.html',
  styleUrls: ['./detalhes-veiculo.component.css']
})
export class DetalhesVeiculoComponent implements OnInit {
  placa = 'abc-123'
  tipo = 'Onibus'
  capacidade = '100'
  cor = 'Vermelho'

  constructor() { }

  ngOnInit() {
  }

}
