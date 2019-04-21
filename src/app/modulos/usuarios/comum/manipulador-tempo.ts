export class ManipuladorTempo 
{
  static converterSegundosParaMinutos(segundos): number
  {
    // segundos += (quantidadePontos - 2) * 30;
    let totalMinutosTrajeto = Math.floor(segundos / 60);

    return totalMinutosTrajeto;
  }
  
  static converterTempoTotalTrajetoParaSegundos(horario: string): number
  {
    let tempo = horario.split(':');
  
    let minutos: number;
    let horas: number;
  
    if (tempo.length > 1)
    {
      if (Number(tempo[0]).valueOf() === 0)
      {
        tempo[0] = Number(24).toString();
      }
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
    if (minutoPartida > 59)
    {
      horaPartida += minutoPartida / 60;
      minutoPartida = minutoPartida % 60;
    }
    if (horaPartida > 23)
    {
      horaPartida -= 24;
    }
    if (minutoPartida.toString().length === 1)
    {
      minutoPartida = '0' + minutoPartida.toString();
    }
    return horaPartida.toFixed(0) + ':' + minutoPartida.toString();
  }
  
  static formatarHorarioTrajeto(segundos): string
  {
    const totalMinutos = this.converterSegundosParaMinutos(segundos)
  
    let hora: number = 0;
    let minutos: any = 0;
  
    if (totalMinutos >= 60)
    {
      hora += totalMinutos / 60;
      minutos += totalMinutos % 60;
  
      if (hora >= 24)
      {
        hora -= 24;
      }
      if (minutos.toString().length === 1)
      {
        minutos = '0' + minutos.toString();
      }
      return Math.trunc(hora) + ':' + minutos.toString();
    }
    return totalMinutos.toString();
  }

  // decrementa 30 segundos para cada ponto de parada removido
  static decrementarTempoTotalTrajeto(segundos): number
  {
    return segundos - 30;
  }

  // adiciona 30 segundos para cada ponto de parada menos a origem e o destino
  static incrementarTempoTotalTrajeto(quantidadePontos, segundos): number
  {
    return segundos += (quantidadePontos - 2) * 30;
  }
}