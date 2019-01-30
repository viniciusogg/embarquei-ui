import { Injectable } from '@angular/core';
import { Usuario } from '../modulos/core/model';

@Injectable()
export class StorageDataService {

  tituloBarraSuperior = 'Embarquei';

  tipoUsuarioLogado: any;

  usuarioLogado: Usuario;

  promptEvent;

  constructor() 
  { 
    // window.addEventListener ('beforeinstallprompt', event => { 
    //   this.promptEvent = event; 
    //   console.log(event);
    // });
  }

  getUsuarioLogado()
  {
    return this.usuarioLogado;
  }

  setUsuarioLogado(usuario: Usuario)
  {
    this.usuarioLogado = usuario;
    // console.log('setando usuario logado...');
    // this.getArrayOpcoes();
  }

}
