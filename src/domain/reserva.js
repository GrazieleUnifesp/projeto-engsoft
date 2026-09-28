export const StatusReserva = Object.freeze({
  PENDENTE: "pendente",
  CONFIRMADA: "confirmada",
  CANCELADA: "cancelada",
  CHECKIN_REALIZADO: "checkin_realizado",
  CONCLUIDA: "concluida",
  NO_SHOW: "no_show",
});

export class ReservaInvalidaError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ReservaInvalidaError";
  }
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export class Reserva {
  constructor({
    id,
    acomodacaoId,
    hospedeId,
    dataCheckin,
    dataCheckout,
    status = StatusReserva.PENDENTE,
    valorTotal = 0,
  }) {
    if (dataCheckout <= dataCheckin) {
      throw new ReservaInvalidaError(
        "Data de check-out deve ser posterior à data de check-in."
      );
    }
    this.id = id;
    this.acomodacaoId = acomodacaoId;
    this.hospedeId = hospedeId;
    this.dataCheckin = dataCheckin;
    this.dataCheckout = dataCheckout;
    this.status = status;
    this.valorTotal = valorTotal;
  }

  numeroDeNoites() {
    return Math.round((this.dataCheckout - this.dataCheckin) / MS_POR_DIA);
  }

  podeCancelar() {
    return (
      this.status === StatusReserva.PENDENTE ||
      this.status === StatusReserva.CONFIRMADA
    );
  }

  cancelar() {
    if (!this.podeCancelar()) {
      throw new ReservaInvalidaError(
        `Não é possível cancelar reserva com status ${this.status}.`
      );
    }
    this.status = StatusReserva.CANCELADA;
  }
}