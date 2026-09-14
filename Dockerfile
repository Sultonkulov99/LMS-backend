# 1. Build bosqichi
FROM node:20-alpine AS builder

WORKDIR /app

# Package fayllarni ko'chirish va o'rnatish
COPY package*.json ./
RUN npm ci

# Prisma 7 va sxema fayllarini ko'chirish
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Prisma Client yaratish
RUN npx prisma generate

# Loyiha kodlarini ko'chirish va build qilish
COPY . .
RUN npm run build --if-present

# 2. Production bosqichi
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Kerakli Prisma build va config fayllarini ko'chirish
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Bazani migratsiya qilish va ilovani ishga tushirish
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
