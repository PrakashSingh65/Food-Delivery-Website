# ==========================================
# Multi-Stage Dockerfile for Food Delivery Backend
# ==========================================

# Stage 1: Dependency resolution and caching
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules (if any)
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create a secure, non-root system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy production node_modules from deps stage
COPY --from=deps --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --chown=expressjs:nodejs package*.json ./
COPY --chown=expressjs:nodejs src ./src

# Set ownership and switch user
USER expressjs

# Expose HTTP & WebSocket port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
