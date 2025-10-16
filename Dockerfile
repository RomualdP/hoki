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

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Verify that dist/main.js exists
RUN echo "=== Verifying production files ===" && \
    ls -la && \
    echo "=== Checking dist directory ===" && \
    ls -la dist/ && \
    echo "=== Checking dist/main.js ===" && \
    test -f dist/main.js && echo "dist/main.js EXISTS" || (echo "dist/main.js MISSING" && exit 1)

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
