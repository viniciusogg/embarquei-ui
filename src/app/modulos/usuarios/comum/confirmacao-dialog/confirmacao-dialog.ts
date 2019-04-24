import { SafeHtml } from "@angular/platform-browser";

export abstract class ConfirmacaoDialog
{
  textoConfirmacao: SafeHtml;
  textoTitulo: string;
  textoBotaoConfirmar: string;
  textoBotaoCancelar: string;

  abstract carregarTextos();

  abstract confirmar();
}