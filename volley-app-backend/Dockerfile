FROM node:22-alpine AS builder

# Cache busting: Updated 2025-10-28 15:30 - Fix ConfigModule injection in ClubManagementModule
RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# Copy all source files and configuration
COPY . .

# Verify configuration files exist
RUN echo "=== Checking configuration files ===" && \
    ls -la nest-cli.json tsconfig.json tsconfig.build.json

RUN npx prisma generate

# Verify Prisma client was generated successfully
RUN echo "=== Verifying Prisma Client Generation ===" && \
    ls -la node_modules/.prisma/ && \
    ls -la node_modules/.prisma/client/ && \
    echo "✓ Prisma client generated successfully"

# Verify NestJS CLI is available
RUN echo "=== Checking NestJS CLI ===" && \
    npx nest --version && \
    echo "=== Checking TypeScript version ===" && \
    npx tsc --version

# Run TypeScript compiler check to see detailed errors if any
RUN echo "=== Running TypeScript type checking ===" && \
    npx tsc --noEmit && \
    echo "✓ TypeScript check passed"

# Build with verbose output to debug
RUN echo "=== Starting NestJS build ===" && \
    yarn build && \
    echo "=== Build completed ===" && \
    echo "=== Listing files in dist/ ===" && \
    find dist/ -type f -name "*.js" | head -30 && \
    echo "=== Searching for main.js ===" && \
    find dist/ -name "main.js" && \
    echo "=== dist/ structure ===" && \
    ls -la dist/

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

# Verify that dist/src/main.js exists
RUN echo "=== Verifying production files ===" && \
    ls -la && \
    echo "=== Checking dist directory ===" && \
    ls -la dist/ && \
    echo "=== Checking dist/src/main.js ===" && \
    test -f dist/src/main.js && echo "dist/src/main.js EXISTS ✓" || (echo "dist/src/main.js MISSING" && exit 1)

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
