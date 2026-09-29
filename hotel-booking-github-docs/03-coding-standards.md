# 03 — Padrões de Código

## Indentação

Todo o projeto usará 4 espaços.

Não usar tabs reais.

```javascript
function calculateTotalPrice(price, nights) {
    return price * nights
}
```

## Comentários

Não utilizar comentários ao longo do código.

A clareza deve vir de:

- nomes descritivos;
- funções pequenas;
- responsabilidades separadas;
- módulos bem definidos;
- abstrações simples.

## Nomenclatura

### Variáveis

Preferir nomes claros:

```javascript
const reservation = await findReservationById(id)
const currentDate = new Date()
```

### Funções

Usar verbos claros:

```text
createReservation
cancelReservation
findAvailableRooms
calculateReservationPrice
validateBookingPeriod
```

### Booleanos

Usar prefixos semânticos:

```text
isAvailable
isAuthenticated
isAdmin
hasReservation
canCancel
shouldAllowOverbooking
```

## Clean Code

- funções com responsabilidade única;
- evitar duplicação;
- early return;
- baixo acoplamento;
- alta coesão;
- validação nas fronteiras;
- regras de negócio centralizadas;
- legibilidade acima de abstração excessiva.

## SOLID

Aplicar quando fizer sentido, principalmente:

- Single Responsibility Principle;
- Open/Closed Principle;
- Dependency Inversion.

Não criar abstrações artificiais apenas para demonstrar padrões.

## Formatação

Prettier deverá respeitar 4 espaços.

## Git

Branches sugeridas:

```text
main
develop
feature/auth
feature/hotel-search
feature/reservations
feature/admin-dashboard
feature/overbooking
fix/reservation-validation
```

Commits:

```text
feat: add hotel search
feat: create reservation flow
fix: prevent invalid checkout date
refactor: extract availability service
style: adjust hotel card layout
docs: update project requirements
```
