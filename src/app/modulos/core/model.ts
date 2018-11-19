export abstract class Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  numeroCelular: string;
  senha: string;
  ativo: boolean;
  endereco: Endereco;
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
  curso: any;
  horariosSemanaisEstudante: Array<HorarioSemanalEstudante>;
  endereco: Endereco;
}

export class HorarioSemanalEstudante {
  id: string;
  diaSemana: DIA_SEMANA;
  temAula: boolean;
  estudante: Estudante;

  constructor(diaSemana, temAula)
  {
    this.diaSemana = diaSemana;
    this.temAula = temAula;
  }
}

export class ComprovanteMatricula {
  id: string;
  caminhoSistemaArquivos: string;
  status: STATUS_COMPROVANTE;
  dataEnvio: any;
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
  cidade: any;
  logradouro: string;
  bairro: string;
}

export class Cidade {
  id: string;
  nome: string;
}

export enum DIA_SEMANA {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA'
}

export class FileUpload {
  url: string;
  file:File;

  constructor(file: File) {
    this.file = file;
  }
}

export enum STATUS_COMPROVANTE {
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO'
}

export enum TIPO_TRAJETO {
  IDA = 'IDA',
  VOLTA = 'VOLTA'
}

export enum TIPO_VEICULO {
  ONIBUS = 'ONIBUS',
  VAN = 'VAN'
}

export enum TIPO_NOTIFICACAO {
  ATRASO_TRANSPORTE = 'ATRASO_TRANSPORTE',
  AUSENCIA_TRANSPORTE = 'AUSENCIA_TRANS',
  RENOVACAO_CADASTRO = 'RENOVACAO_CADASTRO',
  MUDANCA_ROTA = 'MUDANCA_ROTA',
  MUDANCA_MOTORISTA = 'MUDANCA_MOTORISTA',
  MUDANCA_VEICULO = 'MUDANCA_VEICULO',
  CONFIRMACAO_PRESENCA = 'CONFIRMACAO_PRESENCA'
}

