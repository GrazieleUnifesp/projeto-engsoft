# 09 — Banco de Dados e Prisma

## Banco principal

MySQL será a fonte de verdade.

## ORM

Prisma ORM será utilizado para:

- schema;
- migrations;
- queries;
- relacionamentos;
- transações.

## Regras de modelagem

- IDs preferencialmente UUID ou CUID.
- Datas em UTC no banco.
- Valores monetários com Decimal, nunca float.
- CNPJ e CPF armazenados normalizados.
- Soft delete quando histórico precisar ser preservado.
- Índices em campos de pesquisa e relacionamento.

## Índices importantes

- Hotel.status
- Hotel.cnpj
- HotelUnit.city/state ou equivalentes no Address
- Room.unitId
- Room.roomTypeId
- Reservation.userId
- ReservationRoom.roomId
- ReservationRoom.checkIn/checkOut
- Payment.reservationId
- Review.hotel/unit conforme modelo final

## Restrições

- número do quarto único por unidade;
- CNPJ obrigatório;
- CPF obrigatório nos hóspedes;
- checkOut > checkIn;
- percentual de overbooking entre 0 e 10;
- notas entre 1 e 5.

## Transações

Obrigatórias em fluxos como:

- confirmação da reserva;
- cancelamento com atualização financeira;
- alteração de reserva;
- confirmação de pagamento;
- processamento de reembolso.

## Snapshot financeiro

A reserva deve armazenar o preço contratado no momento da criação.

Alterações posteriores de tabela não podem modificar reservas antigas.

## Soft delete

Usar em:

- quartos com histórico;
- entidades críticas que participam de reservas;
- dados necessários para auditoria.


## Entidades adicionais definidas posteriormente

O schema definitivo também deverá prever:

```text
MediaAsset
Promotion
PromotionScope ou relacionamento equivalente
SearchMetric
EmailDelivery ou NotificationDelivery
AdminReviewNote
```

### MediaAsset

Referência a arquivos no Cloudinary, sem binário no banco.

### Promotion

Deverá preservar escopo, tipo, valor, período, mínimo de noites e estado. Reservas deverão armazenar snapshot suficiente para auditoria do desconto aplicado.

### SearchMetric

Poderá guardar agregados por unidade/data para impressões, cliques, favoritos e hospedagens concluídas.

## Precisão monetária

Utilizar `Decimal` no Prisma/MySQL para valores financeiros. Definir escala compatível com BRL, mantendo pelo menos duas casas decimais e evitando `Float`.
