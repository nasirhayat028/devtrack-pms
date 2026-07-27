FROM node:22-alpine

LABEL maintainer="Nasir"
LABEL project="DevTrack"
LABEL version="1.0.0"

WORKDIR /devtrack

COPY package*.json ./

RUN apk add --no-cache wget \
    && addgroup -S appgroup \
    && adduser -S nasir -G appgroup \
    && npm ci --omit=dev

COPY --chown=nasir:appgroup . .

ENV NODE_ENV=production

EXPOSE 5000

HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=10s \
  --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

USER nasir

CMD ["npm", "start"]