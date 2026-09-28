from dataclasses import dataclass
from datetime import date
from enum import Enum


class StatusReserva(Enum):
    PENDENTE = "pendente"
    CONFIRMADA = "confirmada"
    CANCELADA = "cancelada"
    CHECKIN_REALIZADO = "checkin_realizado"
    CONCLUIDA = "concluida"
    NO_SHOW = "no_show"


class ReservaInvalidaError(Exception):
    pass


@dataclass
class Reserva:
    id: int
    acomodacao_id: int
    hospede_id: int
    data_checkin: date
    data_checkout: date
    status: StatusReserva = StatusReserva.PENDENTE
    valor_total: float = 0.0

    def __post_init__(self):
        if self.data_checkout <= self.data_checkin:
            raise ReservaInvalidaError(
                "Data de check-out deve ser posterior à data de check-in."
            )

    def numero_de_noites(self) -> int:
        return (self.data_checkout - self.data_checkin).days

    def pode_cancelar(self) -> bool:
        return self.status in (StatusReserva.PENDENTE, StatusReserva.CONFIRMADA)

    def cancelar(self) -> None:
        if not self.pode_cancelar():
            raise ReservaInvalidaError(
                f"Não é possível cancelar reserva com status {self.status.value}."
            )
        self.status = StatusReserva.CANCELADA