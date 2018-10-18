export abstract class Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  numeroCelular: string;
  senha: string;
  ativo: boolean;
}

export abstract class Mensageiro extends Usuario {

}

export class Administrador extends Usuario {

}

export class Motorista extends Usuario {

}

export class Estudante extends Usuario {
  foto: string;
  pontosParada: Array<PontoParada>;
  comprovanteMatricula: ComprovanteMatricula;
  curso: Curso;
  HorariosSemanaisEstudante: Array<HorarioSemanalEstudante>;
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
  ordem: number;
  estudantes: Array<Estudante>;
  trajeto: Trajeto;
}

export class Trajeto {
  id: string;
  urlMapa: string;
  tipo: TIPO_TRAJETO
  pontosParada: Array<PontoParada>;
  horarioTrajeto: HorarioTrajeto;
  rota: Rota;
}

export class Rota {
  id: string;
  nome: string;
  trajetos: Array<Trajeto>;
  instituicoesEnsino: Array<InstituicaoEnsino>;
}

export class HorarioTrajeto {
  id: string;
  partida: Date;
  chegada: Date;
}

export class Curso {
  id: string;
  nome: string;
}

export class InstituicaoEnsino {
  id: string;
  nome: string;
  cursos: Array<Curso>;
  endereco: Endereco;
}

export class VeiculoTransporte {
  id: string;
  capacidade: number;
  placa: string;
  tipo: TIPO_VEICULO;
  cor: string;
  imagem: string;
  instituicoesEnsino: Array<InstituicaoEnsino>;
}

export class Checkin {
  id: string;
  confirmado: boolean;
  estudante: Estudante;
}

export class ListaPresenca {
  id: string;
  checkins: Array<Checkin>;
  instituicaoEnsino: InstituicaoEnsino;
  cidade: Cidade;
}

export class Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TIPO_NOTIFICACAO;
  dataEnvio: Date;
}

export class RenovacaoCadastro {
  id: string;
  ativa: boolean;
  dataInicio: Date;
  responsavel: Administrador;
  estudantes: Array<Estudante>;
}

export class Endereco {
  id: string;
  cidade: Cidade;
  logradouro: string;
  bairro: string;
}

export class Cidade {
  id: string;
  nome: string;
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

export enum TIPO_TRAJETO {
  IDA,
  VOLTA
}

export enum TIPO_VEICULO {
  ONIBUS,
  VAN
}

export enum TIPO_NOTIFICACAO {
  ATRASO_TRANSPORTE,
  AUSENCIA_TRANSPORTE,
  RENOVACAO_CADASTRO,
  MUDANCA_ROTA,
  MUDANCA_MOTORISTA,
  MUDANCA_VEICULO,
  CONFIRMACAO_PRESENCA
}
