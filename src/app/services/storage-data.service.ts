import { Injectable } from '@angular/core';
import { Usuario } from '../modulos/core/model';

@Injectable({
  providedIn: 'root'
})
export class StorageDataService {

  tituloBarraSuperior = 'Embarquei';

  tipoUsuarioLogado: any;

  usuarioLogado: Usuario;

  promptEvent;

  plataforma;

  constructor() 
  { 
    window.addEventListener('beforeinstallprompt', event => { 
      this.promptEvent = event; 
      this.plataforma = this.promptEvent.platforms[0];
      console.log(this.plataforma);
      console.log(this.promptEvent);
    });
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
