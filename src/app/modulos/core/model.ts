export abstract class Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  numeroCelular: string;
  senha: string;
  ativo: boolean;
}

export class Mensageiro extends Usuario {

}

export class Estudante extends Usuario {
  foto: string;
  pontoParada: Array<PontoParada>;
  comprovanteMatricula: ComprovanteMatricula;
  curso: Curso;
  HorarioSemanalEstudante: Array<HorarioSemanalEstudante>;
  endereco: Endereco;
}

export class HorarioSemanalEstudante {

  id: string;
  diaSemana: DIA_SEMANA;
  estudante: Estudante;

  constructor(diaSemana: DIA_SEMANA, estudante: Estudante)
  {
    this.diaSemana = diaSemana;
    this.estudante = estudante;
  }
}

export class ComprovanteMatricula {
  id: string;
  arquivo: string;
  status: STATUS_COMPROVANTE;
  dataEnvio: Date;
  justificativa: string;
}

export class PontoParada {
  id: string;
  nome: string;
  estudante: Estudante;
}

export class Curso {
  id: string;
  nome: string;
}

export class InstituicaoEnsino {
  id: string;
  nome: string;
  endereco: Endereco;
}

export class Endereco {
  id: string;
  cidade: string;
  logradouro: string;
  bairro: string;
}

export enum DIA_SEMANA {
  SEGUNDA,
  TERCA,
  QUARTA,
  QUINTA,
  SEXTA
}

export enum STATUS_COMPROVANTE {
  EM_ANALISE,
  APROVADO,
  RECUSADO
}
