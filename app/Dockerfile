# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only manifest first for layer caching
COPY package*.json ./

# Install all deps (including dev) for build step
RUN npm ci --only=production

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:18-alpine AS production

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Drop to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Health check for ECS / ALB target group
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "index.js"]
