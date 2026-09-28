# Sistema de Reservas - Resort

Projeto da disciplina de Engenharia de Software (UNIFESP).

## Sobre

Sistema de gestão de reservas de um resort, com política de cancelamento
(multa escalonada por proximidade do check-in) e overbooking controlado.

## Status

Em desenvolvimento. Entidades base do domínio em andamento.

## Tecnologias

- Linguagem: JavaScript (Node.js)
- Testes: Vitest
- Backend: a definir
- Frontend: a definir
- Banco de dados: a definir

## Como rodar

Pré-requisito: Node.js instalado (versão LTS).

```bash
git clone https://github.com/GrazieleUnifesp/projeto-engsoft.git
cd projeto-engsoft
npm install
```

## Como rodar os testes

```bash
npm test
```

## Arquitetura

O projeto é organizado em camadas, e as regras de negócio ficam isoladas
de banco de dados e API:

```
src/
├── domain/           regras de negócio puras (entidades e políticas)
├── application/      casos de uso
├── infrastructure/   banco de dados e repositórios
└── api/              endpoints
tests/                testes automatizados
```

A camada `domain` não depende das outras, o que permite testá-la sem
banco de dados nem servidor.

## Regras de negócio

- Reserva: check-out deve ser posterior ao check-in; só pode ser cancelada
  se estiver pendente ou confirmada.
- Cancelamento: multa por faixa de prazo (mais de 7 dias sem multa,
  de 3 a 7 dias 50%, menos de 72h ou no-show 100%).
- Overbooking: limite de reservas acima da capacidade por tipo de
  acomodação, com realocação e lista de espera.

## Fluxo de trabalho

- Cada tarefa é uma issue no GitHub
- Uma branch por issue ou grupo de issues
- Mudanças entram na `main` via Pull Request com review de outro membro
- Commits referenciam a issue (`Closes #N`)

## Equipe

- Graziele
- Isabela
- Vini