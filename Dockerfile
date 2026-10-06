FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# generate bazaga ulanmaydi, faqat config o'qishi uchun soxta URL
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini

# prisma CLI (migrate deploy) runtime'da kerak, shuning uchun node_modules to'liq olinadi
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 nodejs \
    && adduser -S nodeuser -u 1001 -G nodejs \
    && mkdir -p /app/uploads \
    && chown -R nodeuser:nodejs /app

USER nodeuser
EXPOSE 9000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
