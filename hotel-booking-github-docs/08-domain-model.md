# 08 — Modelo de Domínio

## Entidades principais

### Usuários

- User
- UserRole

### Hotelaria

- Hotel
- HotelUnit
- Address
- HotelImage
- UnitImage
- Policy
- CustomPolicy
- Amenity
- HotelAmenity
- UnitAmenity

### Acomodações

- RoomType
- RoomTypeImage
- BedConfiguration
- RoomTypeAmenity
- Room
- RoomAmenity
- RoomBlock
- UnitBlock

### Reserva

- Reservation
- ReservationRoom
- Guest
- ReservationGuest
- ReservationPriceSnapshot

### Avaliação

- Review
- ReviewScore
- ReviewImage
- ReviewComment
- ReviewReport

### Favoritos

- FavoriteList
- FavoriteItem

### Financeiro

- Payment
- PaymentAttempt
- Refund
- Commission
- ServiceFee

### Comunicação

- Notification
- EmailDelivery

### Administração

- AuditLog

## Relações principais

```text
User 1 ── N Hotel
Hotel 1 ── N HotelUnit
HotelUnit 1 ── N RoomType
RoomType 1 ── N Room
RoomType 1 ── N BedConfiguration
Reservation 1 ── N ReservationRoom
ReservationRoom N ── 1 Room
ReservationRoom 1 ── N Guest
Reservation 1 ── N Payment
Payment 1 ── N Refund
Hotel/Room N ── N FavoriteList
Review 1 ── N ReviewScore
Review 1 ── N ReviewImage
Review 1 ── N ReviewComment
```

## Estados sugeridos

### HotelStatus

```text
DRAFT
UNDER_REVIEW
PUBLISHED
BLOCKED
```

### RoomOperationalStatus

```text
AVAILABLE
UNAVAILABLE
MAINTENANCE
BLOCKED
INACTIVE
```

### ReservationRoomStatus

```text
PENDING_PAYMENT
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
```

### PaymentStatus

```text
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
```

### RefundStatus

```text
REQUESTED
PROCESSING
COMPLETED
FAILED
```

### ReviewReportStatus

```text
PENDING
REVIEWED
ACCEPTED
REJECTED
```
