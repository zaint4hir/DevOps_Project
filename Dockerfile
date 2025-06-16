FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend


COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build   # outputs to /app/frontend/dist by default for Vite

FROM node:18-alpine AS backend-deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:18-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=backend-deps /app/node_modules ./node_modules
COPY --from=backend-deps /app/package.json    ./package.json
COPY server.js ./
COPY routes    ./routes
COPY models    ./models
COPY uploads   ./uploads

COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 5000

USER appuser

CMD ["node", "server.js"]
