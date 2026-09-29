# 24 — RabbitMQ, Jobs e E-mail

## RabbitMQ

RabbitMQ será utilizado para tarefas que não devem bloquear requests web.

## Exchanges e filas sugeridas

```text
app.events
email.send
notifications.dispatch
refund.process
reservation.expiration
checkin.reminder
analytics.aggregate
```

Cada fila crítica deverá possuir Dead Letter Queue correspondente.

## Retry

Política padrão:

```text
Tentativa 1
  ↓ falhou
aguardar 30 minutos
  ↓
Tentativa 2
  ↓ falhou
aguardar 30 minutos
  ↓
Tentativa 3
  ↓ falhou
DLQ
```

Implementar o atraso preferencialmente com retry queue com TTL de 30 minutos e dead-letter exchange.

Jobs deverão armazenar ou carregar:

```text
jobId
type
payload
attempt
correlationId
createdAt
```

## Idempotência

Obrigatória especialmente para:

- reembolso;
- confirmação de pagamento;
- cancelamento;
- envio de notificação crítica;
- agregação financeira.

## E-mail

Utilizar Nodemailer com SMTP.

`EmailService` recebe um template lógico, mas apenas o worker conhece Nodemailer.

## Templates mínimos

- boas-vindas;
- recuperação de senha;
- reserva criada;
- pagamento confirmado/recusado;
- reserva confirmada;
- alteração;
- cancelamento;
- reembolso;
- lembrete 48h;
- resposta em avaliação;
- hotel aprovado;
- hotel bloqueado;
- alerta administrativo.

## Design dos e-mails

Layout padrão:

```text
Logo / nome da plataforma
Título curto
Texto principal
Card com dados essenciais
Botão de ação
Informações auxiliares
Rodapé
```

Usar HTML simples, responsivo e CSS compatível com clientes de e-mail. Incluir sempre versão texto.
