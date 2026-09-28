export const TipoAcomodacao = Object.freeze({
  STANDARD: "standard",
  BANGALO: "bangalo",
  VILLA: "villa",
});

export const StatusAcomodacao = Object.freeze({
  DISPONIVEL: "disponivel",
  MANUTENCAO: "manutencao",
  INATIVA: "inativa",
});

export class Acomodacao {
  constructor({
    id,
    identificador,
    tipo,
    capacidade,
    diariaBase,
    status = StatusAcomodacao.DISPONIVEL,
  }) {
    this.id = id;
    this.identificador = identificador;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.diariaBase = diariaBase;
    this.status = status;
  }

  estaDisponivel() {
    return this.status === StatusAcomodacao.DISPONIVEL;
  }
}