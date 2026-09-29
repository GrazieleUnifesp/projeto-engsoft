# Banco de Dados — Sistema de Reservas de Hotel

## 1. Objetivo

Este documento consolida a modelagem lógica do banco MySQL do sistema. O acesso será feito preferencialmente via Prisma ORM.

Princípios:
- MySQL é a fonte de verdade.
- Redis serve apenas para cache, holds e apoio à concorrência.
- Valores financeiros usam `DECIMAL`, nunca `FLOAT`.
- Registros históricos não devem ser sobrescritos.
- Exclusão física só é permitida quando não existe histórico relacionado.
- Reservas armazenam snapshots de dados e preços relevantes.

## 2. Convenções

Todas as entidades principais usam `id` como PK. Recomenda-se UUID.

Campos temporais padrão:

```text
created_at
updated_at
```

Valores financeiros:

```text
DECIMAL(12,2)
```

Arredondamento financeiro: duas casas decimais, sempre para baixo.

## 3. Usuários

### USER

```text
USER
- id PK
- name
- email UNIQUE
- cpf UNIQUE
- password_hash
- role
- is_active
- created_at
- updated_at
```

`role`:

```text
CUSTOMER
MANAGER
ADMIN
```

Cada usuário possui apenas um role.

## 4. Hotéis e gestores

### HOTEL

```text
HOTEL
- id PK
- owner_user_id FK -> USER.id
- name
- description
- category
- cnpj
- email
- status
- is_active
- created_at
- updated_at
```

Status:

```text
DRAFT
UNDER_REVIEW
PUBLISHED
BLOCKED
```

Regras:
- cada hotel possui um único proprietário;
- o proprietário deve ser `MANAGER`;
- CNPJ é obrigatório;
- publicação exige aprovação administrativa.

### HOTEL_MANAGER

```text
HOTEL_MANAGER
- hotel_id PK/FK -> HOTEL.id
- user_id PK/FK -> USER.id
- created_at
```

Permite vários gestores adicionais. Todos têm os mesmos poderes entre si. O proprietário é superior e não precisa estar duplicado nesta tabela.

## 5. Regras simples de aceitação

Regras como pets, cigarro, crianças, visitantes e eventos não ficam como colunas booleanas em `HOTEL`.

### ACCEPTANCE_TYPE

```text
ACCEPTANCE_TYPE
- id PK
- code UNIQUE
- name
- description
- is_system
- created_at
```

Tipos iniciais:

```text
PETS
SMOKING
CHILDREN
VISITORS
EVENTS
OTHER
```

Os tipos oficiais da plataforma terão `is_system = true`.

### HOTEL_ACCEPTANCE

```text
HOTEL_ACCEPTANCE
- id PK
- hotel_id FK -> HOTEL.id
- acceptance_type_id FK -> ACCEPTANCE_TYPE.id
- custom_label nullable
- is_allowed
- details nullable
- created_at
- updated_at
```

Regras:
- se `acceptance_type != OTHER`, `custom_label = NULL`;
- se `acceptance_type = OTHER`, `custom_label` é obrigatório;
- `OTHER` representa especificidades criadas pelo gestor.

Exemplo:

```text
PETS
is_allowed = true
```

Exemplo customizado:

```text
OTHER
custom_label = "Uso de caixas de som nas áreas externas"
is_allowed = false
details = "Não permitido após as 22h."
```

## 6. Políticas do hotel

### HOTEL_POLICY

```text
HOTEL_POLICY
- id PK
- hotel_id FK
- type
- title
- description
- is_system
- is_active
- created_at
- updated_at
```

Usada para políticas textuais completas, como cancelamento, silêncio, estacionamento e regras adicionais.

Diferença:

```text
HOTEL_ACCEPTANCE -> aceita/não aceita algo
HOTEL_POLICY -> regra textual mais completa
```

## 7. Unidades

### HOTEL_UNIT

```text
HOTEL_UNIT
- id PK
- hotel_id FK
- name
- email
- check_in_time
- check_out_time
- overbooking_percentage
- status
- is_active
- created_at
- updated_at
```

Cada unidade pertence a apenas um hotel.

Overbooking configurável entre 0% e 10%.

### ADDRESS

```text
ADDRESS
- id PK
- unit_id FK UNIQUE
- zip_code
- street
- number
- complement nullable
- neighborhood
- city
- state
- latitude
- longitude
- created_at
- updated_at
```

Cardinalidade:

```text
HOTEL_UNIT 1:1 ADDRESS
```

### UNIT_PHONE

```text
UNIT_PHONE
- id PK
- unit_id FK
- phone
- created_at
```

Cardinalidade:

```text
HOTEL_UNIT 1:N UNIT_PHONE
```

## 8. Tipos de quarto

### ROOM_TYPE

O tipo pertence ao hotel, não à unidade.

```text
ROOM_TYPE
- id PK
- hotel_id FK
- name
- description
- max_guests
- area_m2
- default_price
- is_active
- created_at
- updated_at
```

### BED_CONFIGURATION

```text
BED_CONFIGURATION
- id PK
- room_type_id FK
- bed_type
- quantity
```

`bed_type`:

```text
SINGLE
DOUBLE
QUEEN
KING
SOFA_BED
```

## 9. Quartos físicos

### ROOM

```text
ROOM
- id PK
- unit_id FK
- room_type_id FK
- number
- floor
- status
- is_accessible
- administrative_notes nullable
- is_active
- created_at
- updated_at
```

Status:

```text
AVAILABLE
UNAVAILABLE
MAINTENANCE
BLOCKED
INACTIVE
```

Restrição:

```text
UNIQUE(unit_id, number)
```

## 10. Histórico de categoria e preço

### ROOM_TYPE_HISTORY

```text
ROOM_TYPE_HISTORY
- id PK
- room_id FK
- room_type_id FK
- valid_from
- valid_until nullable
```

### ROOM_PRICE_HISTORY

```text
ROOM_PRICE_HISTORY
- id PK
- room_id FK
- price
- valid_from
- valid_until nullable
- created_at
```

### ROOM_PRICE_PERIOD

```text
ROOM_PRICE_PERIOD
- id PK
- room_id FK
- start_date
- end_date
- price
- created_at
- updated_at
```

Prioridade:

```text
1. preço específico do período
2. preço atual específico do quarto
3. preço padrão do ROOM_TYPE
```

## 11. Comodidades

### AMENITY

```text
AMENITY
- id PK
- created_by_user_id FK nullable
- name
- is_global
- is_active
- created_at
```

Relacionamentos:

```text
HOTEL_AMENITY
UNIT_AMENITY
ROOM_TYPE_AMENITY
ROOM_AMENITY
```

Cada tabela associativa deve impedir duplicidade do mesmo par.

## 12. Imagens

Cloudinary será usado para armazenamento.

### HOTEL_IMAGE

```text
HOTEL_IMAGE
- id PK
- hotel_id FK
- cloudinary_public_id
- url
- is_cover
- position
- created_at
```

Regras:
- máximo de 10 imagens;
- exatamente uma capa.

### UNIT_IMAGE

```text
UNIT_IMAGE
- id PK
- unit_id FK
- cloudinary_public_id
- url
- is_cover
- position
- created_at
```

Sem limite funcional definido, mas com exatamente uma capa.

### ROOM_TYPE_IMAGE

```text
ROOM_TYPE_IMAGE
- id PK
- room_type_id FK
- cloudinary_public_id
- url
- position
- created_at
```

Quartos físicos não possuem galeria própria.

## 13. Bloqueios de disponibilidade

### UNIT_BLOCK

```text
UNIT_BLOCK
- id PK
- unit_id FK
- start_at
- end_at
- reason
- created_by_user_id FK
- created_at
```

### ROOM_BLOCK

```text
ROOM_BLOCK
- id PK
- room_id FK
- start_at
- end_at
- reason
- created_by_user_id FK
- created_at
```

## 14. Reservas

### RESERVATION

```text
RESERVATION
- id PK
- user_id FK
- code UNIQUE
- check_in
- check_out
- status
- gross_amount
- service_fee
- total_amount
- created_at
- updated_at
```

Status:

```text
PENDING_PAYMENT
CONFIRMED
PARTIALLY_CANCELLED
CANCELLED
COMPLETED
NO_SHOW
```

### RESERVATION_ROOM

```text
RESERVATION_ROOM
- id PK
- reservation_id FK
- room_id FK
- room_type_name_snapshot
- room_number_snapshot
- unit_name_snapshot
- base_price_snapshot
- total_price
- status
- created_at
- updated_at
```

Status:

```text
PENDING_PAYMENT
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
```

## 15. Hóspedes

### GUEST

```text
GUEST
- id PK
- reservation_room_id FK
- full_name
- cpf
- birth_date
- created_at
```

Regras:
- CPF obrigatório;
- hóspede pertence ao quarto reservado;
- registro novo a cada reserva;
- criança: até 12 anos;
- bebê é tratado como criança.

## 16. Pagamentos

### PAYMENT

```text
PAYMENT
- id PK
- reservation_id FK
- method
- status
- gross_amount
- installments
- stripe_payment_intent_id nullable
- created_at
- updated_at
```

Métodos:

```text
CREDIT_CARD
DEBIT_CARD
PIX
```

Status:

```text
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
```

Uma reserva pode possuir vários pagamentos.

## 17. Reembolsos

### REFUND

```text
REFUND
- id PK
- payment_id FK
- reservation_room_id FK
- amount
- status
- stripe_refund_id nullable
- created_at
- updated_at
```

Status:

```text
REQUESTED
PROCESSING
COMPLETED
FAILED
```

Regras:
- ligado simultaneamente ao pagamento e ao quarto reservado;
- cancelamento com pelo menos 24h de antecedência: reembolso integral;
- com menos de 24h: sem reembolso;
- cancelamento parcial reembolsa apenas o quarto cancelado.

## 18. Avaliações

### REVIEW

```text
REVIEW
- id PK
- reservation_room_id FK UNIQUE
- user_id FK
- overall_score
- comment
- is_hidden
- created_at
```

Uma `RESERVATION_ROOM` gera no máximo uma avaliação.

### REVIEW_SCORE

```text
REVIEW_SCORE
- id PK
- review_id FK
- criterion
- score
```

Critérios:

```text
CLEANLINESS
LOCATION
SERVICE
COMFORT
VALUE_FOR_MONEY
```

### REVIEW_MEDIA

```text
REVIEW_MEDIA
- id PK
- review_id FK
- type
- cloudinary_public_id
- url
- created_at
```

`type`:

```text
IMAGE
VIDEO
```

Máximo de 4 mídias por avaliação.

### REVIEW_COMMENT

```text
REVIEW_COMMENT
- id PK
- review_id FK
- author_user_id FK
- content
- created_at
```

Thread livre. Comentários não podem ser excluídos.

### REVIEW_REPORT

```text
REVIEW_REPORT
- id PK
- review_id FK
- reported_by_user_id FK
- reason
- status
- reviewed_by_user_id FK nullable
- created_at
- reviewed_at nullable
```

Se a denúncia for aceita, a avaliação é ocultada, não apagada.

## 19. Favoritos

### FAVORITE_HOTEL_LIST

```text
FAVORITE_HOTEL_LIST
- id PK
- user_id FK
- name
- created_at
```

### FAVORITE_HOTEL_ITEM

```text
FAVORITE_HOTEL_ITEM
- id PK
- list_id FK
- hotel_id FK
- created_at
```

Restrição:

```text
UNIQUE(list_id, hotel_id)
```

### FAVORITE_ROOM_LIST

```text
FAVORITE_ROOM_LIST
- id PK
- user_id FK
- name
- created_at
```

### FAVORITE_ROOM_ITEM

```text
FAVORITE_ROOM_ITEM
- id PK
- list_id FK
- room_id FK
- created_at
```

Restrição:

```text
UNIQUE(list_id, room_id)
```

## 20. Promoções

### PROMOTION

```text
PROMOTION
- id PK
- created_by_user_id FK
- name
- discount_type
- discount_value
- minimum_booking_value
- valid_from
- valid_until
- stay_from
- stay_until
- usage_limit nullable
- usage_count
- is_active
- created_at
- updated_at
```

Tipo:

```text
PERCENTAGE
FIXED_AMOUNT
```

Alvos:

```text
PROMOTION_HOTEL
PROMOTION_UNIT
PROMOTION_ROOM_TYPE
PROMOTION_ROOM
```

Regras:
- promoções não cumulativas;
- aplicar a que gerar o menor preço;
- período de validade obrigatório;
- período de hospedagem elegível obrigatório;
- pode existir limite de usos;
- pode existir valor mínimo.

## 21. Notificações

### NOTIFICATION

```text
NOTIFICATION
- id PK
- user_id FK
- type
- title
- message
- metadata JSON
- is_read
- created_at
```

### EMAIL_DELIVERY

```text
EMAIL_DELIVERY
- id PK
- user_id FK
- notification_id FK nullable
- recipient
- subject
- status
- attempt_count
- last_error nullable
- sent_at nullable
- created_at
- updated_at
```

Status:

```text
PENDING
SENT
FAILED
```

## 22. Jobs

### JOB_EXECUTION

```text
JOB_EXECUTION
- id PK
- type
- reference_type
- reference_id
- status
- attempts
- payload JSON
- last_error nullable
- scheduled_at
- executed_at nullable
- created_at
```

RabbitMQ:
- máximo 3 tentativas;
- retry após 30 minutos;
- falha final vai para DLQ.

## 23. Pesquisa

### SEARCH_HISTORY

```text
SEARCH_HISTORY
- id PK
- user_id FK
- destination
- check_in
- check_out
- guests
- filters JSON
- created_at
```

Manter apenas as últimas 10 pesquisas por usuário.

### SEARCH_IMPRESSION

```text
SEARCH_IMPRESSION
- id PK
- user_id FK nullable
- unit_id FK
- search_id FK nullable
- created_at
```

### SEARCH_CLICK

```text
SEARCH_CLICK
- id PK
- user_id FK nullable
- unit_id FK
- search_id FK nullable
- created_at
```

## 24. Analytics

### DAILY_METRIC

```text
DAILY_METRIC
- id PK
- date
- hotel_id FK nullable
- unit_id FK nullable
- room_type_id FK nullable
- gross_revenue
- net_revenue
- platform_commission
- service_fee_revenue
- reservations_count
- cancellations_count
- no_show_count
- completed_stays
- occupancy_rate
- created_at
- updated_at
```

## 25. Auditoria

### AUDIT_LOG

```text
AUDIT_LOG
- id PK
- user_id FK
- action
- entity_type
- entity_id
- before_data JSON
- after_data JSON
- reason nullable
- ip_address
- user_agent
- created_at
```

Ações auditáveis incluem:

```text
CREATE
UPDATE
DELETE
BLOCK
APPROVE
CANCEL
REFUND
PRICE_CHANGE
AVAILABILITY_CHANGE
```

Logs são imutáveis.

## 26. Configurações globais

### SYSTEM_SETTING

```text
SYSTEM_SETTING
- id PK
- key UNIQUE
- value
- value_type
- updated_by_user_id FK
- updated_at
```

Exemplos:

```text
PLATFORM_COMMISSION_PERCENT = 10
SERVICE_FEE_PERCENT = 10
MAX_OVERBOOKING_PERCENT = 10
RESERVATION_HOLD_MINUTES = 15
MAX_BOOKING_ADVANCE_DAYS = 365
JOB_RETRY_MINUTES = 30
MAX_JOB_ATTEMPTS = 3
```

## 27. Índices recomendados

```text
RESERVATION(user_id)
RESERVATION(check_in, check_out)
RESERVATION(status)

ROOM(unit_id)
ROOM(room_type_id)
ROOM(status)

ROOM_BLOCK(room_id, start_at, end_at)
UNIT_BLOCK(unit_id, start_at, end_at)

ADDRESS(city, state)

PAYMENT(reservation_id)
PAYMENT(status)

REFUND(payment_id)
REFUND(reservation_room_id)

REVIEW(reservation_room_id)
REVIEW(user_id)

SEARCH_IMPRESSION(unit_id, created_at)
SEARCH_CLICK(unit_id, created_at)
```

## 28. Exclusão lógica

Pode haver exclusão física apenas quando não existe histórico.

Usar inativação para:

```text
USER
HOTEL
HOTEL_UNIT
ROOM_TYPE
ROOM
PROMOTION
AMENITY
```

quando houver histórico.

Nunca apagar registros históricos importantes de:

```text
RESERVATION
RESERVATION_ROOM
PAYMENT
REFUND
REVIEW
AUDIT_LOG
```

## 29. Redis fora do DER

Redis não é entidade relacional.

Usos:

```text
reservation hold de 15 minutos
cache de pesquisa
cache de disponibilidade
cache de hotéis
cache de dashboard
locks temporários
```

MySQL continua sendo a fonte de verdade.

## 30. Regras de integridade principais

```text
check_out > check_in
```

```text
check_in <= data atual + 1 ano
```

Reserva no mesmo dia é permitida se criada pelo menos 1 hora antes do check-in.

Conflito de datas:

```text
new_check_in < existing_check_out
AND
new_check_out > existing_check_in
```

Um quarto nunca pode ter duas reservas confirmadas conflitantes.

Hold:

```text
15 minutos
```

Pagamento recusado não reinicia o hold.

Parcelamento:

```text
valor bruto > R$ 1.500
-> até 12x sem juros
```

## 31. Cardinalidades principais

```text
USER 1:N HOTEL
```

como proprietário.

```text
USER N:N HOTEL
```

via `HOTEL_MANAGER`.

```text
HOTEL 1:N HOTEL_UNIT
HOTEL_UNIT 1:1 ADDRESS
HOTEL 1:N ROOM_TYPE
HOTEL_UNIT 1:N ROOM
ROOM_TYPE 1:N ROOM
USER 1:N RESERVATION
RESERVATION 1:N RESERVATION_ROOM
ROOM 1:N RESERVATION_ROOM
RESERVATION_ROOM 1:N GUEST
RESERVATION 1:N PAYMENT
PAYMENT 1:N REFUND
RESERVATION_ROOM 1:N REFUND
RESERVATION_ROOM 1:0..1 REVIEW
REVIEW 1:N REVIEW_SCORE
REVIEW 1:N REVIEW_MEDIA
REVIEW 1:N REVIEW_COMMENT
REVIEW 1:N REVIEW_REPORT
HOTEL 1:N HOTEL_ACCEPTANCE
ACCEPTANCE_TYPE 1:N HOTEL_ACCEPTANCE
```

## 32. Próximos passos

Ordem recomendada:

1. criar DER visual;
2. revisar cardinalidades;
3. gerar modelo lógico;
4. definir enums finais;
5. gerar `schema.prisma`;
6. criar migrations;
7. criar seeds;
8. criar índices;
9. implementar repositories;
10. implementar services;
11. testar integridade e concorrência.
