FROM node:22-alpine AS builder

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate

# Build with verbose output to debug
RUN echo "=== Starting NestJS build ===" && \
    yarn build && \
    echo "=== Build completed ===" && \
    ls -la dist/ && \
    echo "=== dist/main.js exists: ===" && \
    test -f dist/main.js && echo "YES" || echo "NO"

FROM node:22-alpine AS production

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
