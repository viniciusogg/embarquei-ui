import { AbstractControl } from "@angular/forms";

export class ValidadorHora {

  static validateHour(control: AbstractControl)
  {
    const valorCampoHora = control.value;

    const time = valorCampoHora.split(':');

    const hour: number = time[0];
    const minutes: number = time[1];

    if (hour > 23) 
    {
      return { invalidHour: true};
    }
    if (minutes > 59)
    {
      return { invalidHour: true};
    }
    return null;
  }
  
}
