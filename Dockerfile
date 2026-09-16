# 1. Build bosqichi
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate
COPY . .
RUN npm run build --if-present

# 2. Production bosqichi
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache tini

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 nodejs \
    && adduser -S nodeuser -u 1001 -G nodejs \
    && mkdir -p /app/uploads \
    && chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
