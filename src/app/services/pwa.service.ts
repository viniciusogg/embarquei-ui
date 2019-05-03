import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PWAService 
{
  constructor(private swUpdate: SwUpdate) 
  {
    swUpdate.available.subscribe(event => 
    {
      // if (askUserToUpdate()) 
      // {
      console.log('Existe uma nova versão');
      window.location.reload();
      // }
    });
  }

  // askUserToUpdate(): boolean
  // {
  //   window.alert()
  // }
}
