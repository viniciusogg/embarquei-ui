import { Injectable } from '@angular/core';
import { Usuario } from '../modulos/core/model';

@Injectable()
export class StorageDataService {

  tituloBarraSuperior = 'Embarquei';

  tipoUsuarioLogado: any;

  usuarioLogado: Usuario;

  constructor() { }


}
