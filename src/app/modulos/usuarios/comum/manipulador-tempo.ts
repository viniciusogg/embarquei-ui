export class ManipuladorTempo 
{
  private static converterSegundosParaMinutos(segundos, quantidadePontos): number
  {
    // adiciona 30 segundos para cada ponto de parada menos a origem e o destino
    segundos += (quantidadePontos - 2) * 30;
  
    let totalMinutosTrajeto = Math.floor(segundos / 60);
  
    return totalMinutosTrajeto;
  }
  
  static converterTempoTotalTrajetoParaSegundos(hora: string): number
  {
    let tempo = hora.split(':');
  
    let minutos: number;
    let horas: number;
  
    if (tempo.length > 1)
    {
      horas = Number.parseInt(tempo[0]).valueOf();
      minutos = Number.parseInt(tempo[1]).valueOf();
  
      return (minutos + (horas * 60)) * 60 ;
    }
    return minutos * 60;
  }
  
  // Retorna minutos ou horas se houverem mais de 60 minutos
  // minutos = tempo total do trajeto
  static calcularHoraChegada(partida: string, tempoTotalTrajeto: string): string
  {
    const arrayPartida = partida.split(':');
      
    let horaPartida: any = Number.parseInt(arrayPartida[0]);
    let minutoPartida: any = Number.parseInt(arrayPartida[1]);
    
    const arrayTempoTotalTrajeto = tempoTotalTrajeto.split(':');
  
    if (arrayTempoTotalTrajeto.length > 1)
    {
      let horaTempoTotal: any = Number.parseInt(arrayTempoTotalTrajeto[0]);
      let minutoTempoTotal: any = Number.parseInt(arrayTempoTotalTrajeto[1]);
  
      horaPartida += horaTempoTotal;
      minutoPartida += minutoTempoTotal
    }
    else
    {
      minutoPartida += Number.parseInt(arrayTempoTotalTrajeto[0]);
    }
    if (horaPartida > 23)
    {
      horaPartida -= 24;
    }
    if (minutoPartida.toString().length === 1)
    {
      minutoPartida = '0' + minutoPartida.toString();
    }
    return horaPartida.toString() + ':' + minutoPartida.toString();
  }
  
  static formatarTempoTotalTrajeto(segundos, quantidadePontos): string
  {
    const totalMinutosTrajeto = this.converterSegundosParaMinutos(segundos, quantidadePontos)
  
    let hora: number = 0;
    let minutos: any = 0;
  
    if (totalMinutosTrajeto >= 60)
    {
      hora += totalMinutosTrajeto / 60;
      minutos += totalMinutosTrajeto % 60;
  
      if (minutos.toString().length === 1)
      {
        minutos = '0' + minutos.toString();
      }
      return hora.toFixed(0) + ':' + minutos.toString();
    }
    return totalMinutosTrajeto.toString();
  }

  // decrementa 30 segundos para cada ponto de parada removido
  static decrementarTempoTotalTrajeto(segundos): number
  {
    return segundos - 30;
  }
}