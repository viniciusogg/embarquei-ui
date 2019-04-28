import { database } from "firebase";

export abstract class Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  numeroCelular: string;
  senha: string;
  ativo: boolean;
  endereco?: Endereco;
  linkFoto?: string;
  beta: boolean;
}

export abstract class Mensageiro extends Usuario {

}

export class Administrador extends Usuario {

}

export class Motorista extends Usuario {
  foto?: Imagem;
  instituicoesEnsino: Array<InstituicaoEnsino>;
  cidade: Cidade;
}

export class Estudante extends Usuario {
  foto?: Imagem;
  pontosParada: Array<PontoParada>;
  comprovanteMatricula: ComprovanteMatricula;
  curso: Curso; //Curso
  horariosSemanaisEstudante: Array<HorarioSemanalEstudante>;
  endereco: Endereco;
}

export class HorarioSemanalEstudante {
  id: string;
  diaSemana: DIA_SEMANA;
  temAula: boolean;
  estudante?: Estudante;

  constructor(diaSemana, temAula)
  {
    this.diaSemana = diaSemana;
    this.temAula = temAula;
  }
}

export class PontoParada {
  id: string;
  nome: string;
  ordem: number;
  estudantes?: Array<Estudante>;
  trajeto: Trajeto;
  geolocalizacao: Geolocalizacao;
}

export class Trajeto {
  id: string;
  descricao: string;
  ativado: boolean;
  tipo: TIPO_TRAJETO
  pontosParada?: Array<PontoParada>;
  horarioTrajeto?: HorarioTrajeto;
  rota?: Rota;
  nomeCampo?: string;
}

export class Rota {
  id: string;
  trajetos: Array<Trajeto>;
  instituicoesEnsino: Array<InstituicaoEnsino>;
  cidade: Cidade;
}

export class HorarioTrajeto {
  id: string;
  partida: any; // datetime=HH:mm
  chegada: any; // datetime=HH:mm
  nomeCampo?: string;
}

export class Curso {
  id: string;
  nome: string;
  instituicaoEnsino: InstituicaoEnsino;
}

export class InstituicaoEnsino {
  id: string;
  nome: string;
  cursos?: Array<Curso>;
  endereco?: Endereco;
  geolocalizacao: Geolocalizacao;
}

export class VeiculoTransporte {
  id: string;
  capacidade: number;
  placa: string;
  tipo: TIPO_VEICULO;
  cor: string;
  imagem?: Imagem;
  linkFoto?: string;
  instituicoesEnsino: Array<InstituicaoEnsino>;
  cidade: Cidade;
}

export class Checkin {
  id: string;
  status: STATUS_CHECKIN;
  estudante?: Estudante;
  dataUltimaAtualizacao: Date;
}

export class ListaPresenca {
  id: string;
  checkins: Array<Checkin>;
  instituicaoEnsino: InstituicaoEnsino;
  cidade: Cidade;
  horarioAtivo?: boolean;
  horarioPartidaMunicipioOrigem?: string;
}

export class Notificacao {
  id: string;
  descricao: string;
  tipo: TIPO_NOTIFICACAO;
  dataEnvio: any;
  lida: boolean;
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
  nome?: string;
  geolocalizacao?: Geolocalizacao;
}

export abstract class Arquivo {
  id: string;
  caminhoSistemaArquivos?: string;
}

export class Imagem extends Arquivo {

}

export class Feedback {
  id: string;
  data: Date;
  comentario: string;
  detalhesPlataforma: string;
  idUsuario: string;
  tipo: TIPO_FEEDBACK;
}

export class ComprovanteMatricula extends Arquivo {
  status: STATUS_COMPROVANTE;
  dataEnvio: any;
  justificativa: string;
}

export class Geolocalizacao {
  lat: any;
  lng: any;
}

export enum DIA_SEMANA {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA'
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
  AUSENCIA_TRANSPORTE = 'AUSENCIA_TRANSPORTE',
  RENOVACAO_CADASTRO = 'RENOVACAO_CADASTRO',
  MUDANCA_ROTA = 'MUDANCA_ROTA',
  MUDANCA_MOTORISTA = 'MUDANCA_MOTORISTA',
  MUDANCA_VEICULO = 'MUDANCA_VEICULO',
  CONFIRMACAO_PRESENCA = 'CONFIRMACAO_PRESENCA'
}

export enum COLECAO_ARQUIVO {
  COMPROVANTES_MATRICULA = 'comprovantes_matricula',
  FOTOS_CONTAS = 'fotos_contas',
  FOTOS_VEICULOS = 'fotos_veiculos'
}

export enum STATUS_CHECKIN {
  CONFIRMADO = 'CONFIRMADO',
  EMBARCOU = 'EMBARCOU',
  AGUARDANDO_CONFIRMACAO = 'AGUARDANDO_CONFIRMACAO'
}

export enum TIPO_FEEDBACK {
  SUGESTAO = 'SUGESTAO',
  BUG = 'BUG',
  OUTRO = 'OUTRO'
}