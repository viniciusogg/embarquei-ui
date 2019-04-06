import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

export abstract class AjudaDialog
{
  tipoAjuda: string;
  textoAjuda: SafeHtml;
  textoTitulo: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, protected sanitizer: DomSanitizer)
  {
    this.tipoAjuda = data.tipoAjuda;
    this.carregarTextoAjuda();
  }

  abstract carregarTextoAjuda();
}