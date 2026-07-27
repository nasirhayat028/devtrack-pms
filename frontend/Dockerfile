###############################################################################
#                           STAGE 1 - BUILDER
###############################################################################
FROM node:22-alpine AS builder

WORKDIR /devtrack

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


###############################################################################
#                        STAGE 2 - PRODUCTION
###############################################################################
FROM nginx:alpine

# Stage 1 (builder) se compiled code ko Nginx ke default folder mein copy karein
COPY --from=builder /devtrack/dist /usr/share/nginx/html

# Agar aapke paas custom nginx.conf hai to is line ko uncomment karein:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0 || exit 1

CMD ["nginx", "-g", "daemon off;"]
