# 22 — Mídia e Uploads

## Provedor

Cloudinary será responsável por armazenamento, transformação e entrega de imagens e vídeos.

## Persistência

MySQL deverá guardar somente metadados, por exemplo:

```text
publicId
secureUrl
resourceType
format
bytes
width
height
duration
createdAt
```

## Limites por contexto

### Hotel

- máximo de 10 fotos no cadastro principal.

### Unidade

- sem limite funcional fixo definido pelo domínio;
- sujeita à cota do Cloudinary e às proteções gerais contra abuso.

### Avaliação/comentário

- máximo de 4 imagens;
- JPG ou JPEG;
- vídeos MP4, WebM ou MOV;
- duração máxima do vídeo: 10 segundos.

## Tamanho de imagem

A regra de produto admite até 50 MB por imagem.

No ambiente acadêmico usando o plano gratuito atual do Cloudinary, o limite técnico efetivo deve ser reduzido ao máximo aceito pelo plano. A aplicação deverá expor o limite efetivo configurado, em vez de permitir um upload que o provedor recusará.

Configuração sugerida:

```env
MAX_IMAGE_UPLOAD_MB=10
MAX_REVIEW_VIDEO_SECONDS=10
```

Se o plano for alterado futuramente, `MAX_IMAGE_UPLOAD_MB` poderá ser elevado até 50 sem alterar a regra de domínio.

## Vídeos

Para o trabalho, limitar arquivos de vídeo a 50 MB além do limite de 10 segundos, mesmo que o provedor suporte valor superior.

## Segurança

- validar MIME e extensão;
- validar tamanho;
- validar duração de vídeo;
- gerar `publicId` controlado pela aplicação;
- não expor `CLOUDINARY_API_SECRET`;
- apagar asset do Cloudinary apenas após validação de autorização;
- limpar uploads órfãos quando uma operação de cadastro falhar.

## Pastas sugeridas

```text
hotels/{hotelId}
units/{unitId}
room-types/{roomTypeId}
rooms/{roomId}
reviews/{reviewId}
```
