from dataclasses import dataclass


@dataclass
class Hospede:
    id: int
    nome: str
    email: str
    telefone: str
    documento: str