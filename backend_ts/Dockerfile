# =============================================
# Backend TypeScript — Dockerfile para Render
# =============================================
#
# Stage 1 (build):
#   - Instala TODAS las dependencias (incluye devDependencies)
#   - Genera el cliente de Prisma para PostgreSQL
#   - Compila TypeScript a JavaScript (tsc)
#
# Stage 2 (produccion):
#   - Instala SOLO dependencias de produccion
#   - Copia el JS compilado + schema + migraciones de Prisma
#   - Al arrancar: aplica migraciones pendientes y levanta el server
#
# En Render se configura:
#   - Build Command:  (lo resuelve este Dockerfile)
#   - Start Command:  (lo resuelve este CMD)
#   - Environment:    DATABASE_URL, EMAIL_USER, EMAIL_PASS, CORS_ORIGINS
# =============================================

# ----- Stage 1: Build -----
FROM node:20-alpine AS build
WORKDIR /app

# Copio los manifests de dependencias primero -> mejor cacheo de capas.
# Si solo cambia el codigo fuente, npm ci NO se vuelve a ejecutar.
COPY package.json package-lock.json ./
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN npm ci

# Config + schema + migraciones de Prisma.
# prisma7.config.ts es obligatorio: ahi vive la datasource url.
COPY prisma7.config.ts ./
COPY prisma ./prisma

# URL de placeholder SOLO para `prisma generate` en build time
# (generate no conecta a la DB, solo necesita que la variable exista).
# La URL real la inyecta Render en RUNTIME, no en build.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/build"
RUN npx prisma generate

# Compilo TypeScript -> dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ----- Stage 2: Produccion -----
FROM node:20-alpine
WORKDIR /app

# Solo dependencias de produccion (imagen mas chica)
COPY package.json package-lock.json ./
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN npm ci --omit=dev

# Prisma: schema + migraciones + config.
# Son necesarios en runtime para `prisma migrate deploy`.
COPY prisma7.config.ts ./
COPY prisma ./prisma

# Codigo compilado (incluye el cliente Prisma generado en src/generated)
COPY --from=build /app/dist ./dist

# Directorio para archivos subidos (efimero en Render free tier)
RUN mkdir -p uploads

# Render inyecta PORT y DATABASE_URL como variables de entorno.
# IMPORTANTE: si no hay migraciones pendientes, `migrate deploy` sale rapido.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
