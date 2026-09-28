from dataclasses import dataclass
from enum import Enum


class TipoAcomodacao(Enum):
    STANDARD = "standard"
    BANGALO = "bangalo"
    VILLA = "villa"


class StatusAcomodacao(Enum):
    DISPONIVEL = "disponivel"
    MANUTENCAO = "manutencao"
    INATIVA = "inativa"


@dataclass
class Acomodacao:
    id: int
    identificador: str
    tipo: TipoAcomodacao
    capacidade: int
    diaria_base: float
    status: StatusAcomodacao = StatusAcomodacao.DISPONIVEL

    def esta_disponivel(self) -> bool:
        return self.status == StatusAcomodacao.DISPONIVEL