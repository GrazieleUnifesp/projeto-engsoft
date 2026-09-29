# 23 — Mapas, Pesquisa, Relevância e Promoções

# Mapas

## Stack

- Leaflet / React Leaflet para UI;
- OpenStreetMap para mapa base;
- Nominatim para geocodificação de baixo volume.

## Política de geocodificação

Ao salvar ou alterar endereço da unidade:

```text
normalizar endereço
→ verificar cache
→ geocodificar se necessário
→ persistir latitude/longitude
→ permitir ajuste manual do pin
```

Não geocodificar durante cada renderização ou pesquisa.

O backend deverá respeitar controle de taxa do Nominatim e identificar adequadamente a aplicação.

Autocomplete de endereço não deverá consultar o Nominatim público a cada tecla. Para o trabalho, usar campos estruturados de endereço e executar geocodificação somente ao confirmar o cadastro.

## Distância

Para ordenação/filtro por distância, utilizar coordenadas já persistidas. MySQL poderá usar função geoespacial apropriada ou cálculo Haversine encapsulado no repository.

# Relevância

A primeira versão será simples, determinística e explicável.

Componentes normalizados entre 0 e 1:

```text
ratingScore     = averageRating / 5
ctrScore        = clicks / max(impressions, 1)
favoriteScore   = favorites / max(impressions, 1)
stayScore       = log(1 + completedStays) / log(1 + maxCompletedStays)
```

Score final:

```text
relevance =
    ratingScore   * 0.35 +
    stayScore     * 0.30 +
    ctrScore      * 0.20 +
    favoriteScore * 0.15
```

Regras adicionais:

- resultado indisponível no período não deve aparecer como reservável;
- hotéis bloqueados ou não publicados não entram no ranking;
- métricas podem ser agregadas por unidade;
- pesos podem ser ajustados depois com dados seedados sem mudar o contrato.

## Destinos populares

Destinos populares serão cidades brasileiras ordenadas pela quantidade de check-ins efetivamente realizados.

Para demonstração, os dados seedados deverão incluir check-ins históricos suficientes para alimentar esse ranking.

# Promoções

## Escopo

O gestor poderá criar promoção para:

- hotel;
- unidade;
- tipo de acomodação;
- quarto físico.

## Tipos

```text
PERCENTAGE
FIXED_AMOUNT
```

## Campos sugeridos

```text
id
name
type
value
startsAt
endsAt
stayStartsAt
stayEndsAt
minimumNights
isActive
scopeType
scopeId
createdBy
```

## Regras

- percentual entre 1% e 70%;
- desconto fixo não pode reduzir a diária abaixo de R$ 1,00;
- promoções não acumulam;
- aplicar automaticamente a promoção que gerar o menor preço;
- desconto ocorre antes da comissão e taxa de serviço;
- reserva guarda snapshot da promoção;
- alterar uma promoção não altera reservas existentes;
- promoção expirada não pode ser aplicada a novas reservas;
- gestor só pode criar promoção em recursos sob sua gestão.

## Ordem de preço

```text
preço de período
→ preço específico do quarto
→ preço padrão do tipo
→ melhor promoção válida
→ valor bruto
→ comissão 10%
→ taxa de serviço 10%
```
