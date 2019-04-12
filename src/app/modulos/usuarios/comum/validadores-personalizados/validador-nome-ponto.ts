import { AbstractControl } from "@angular/forms";

export class ValidadorNomePonto {

  static validateName(control: AbstractControl)
  {
    const valorCampoNome = control.value;

    if (valorCampoNome === '-') 
    {
      return { invalidName: true};
    }
    return null;
  } 
}
