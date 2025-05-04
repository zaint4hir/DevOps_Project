# Stage 1: Build the React (Vite) frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ .
RUN npm run build   # outputs to /app/frontend/dist by default for Vite

# Stage 2: Install backend production deps
FROM node:18-alpine AS backend-deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

# Stage 3: Final runtime image
FROM node:18-alpine

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy backend code + prod deps
COPY --from=backend-deps /app/node_modules ./node_modules
COPY --from=backend-deps /app/package.json    ./package.json
# adjust if your server entrypoint is index.js or server.js
COPY server.js ./
COPY routes    ./routes
COPY models    ./models
COPY uploads   ./uploads

# Copy built frontend into public folder
COPY --from=frontend-build /app/frontend/dist ./public

# Expose API port
EXPOSE 5000

# Switch to non-root
USER appuser

# Start the server
CMD ["node", "server.js"]
