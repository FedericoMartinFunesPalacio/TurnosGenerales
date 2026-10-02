# =============================================
# Backend TypeScript — Multi-stage Dockerfile
# =============================================
#
# Stage 1 (build):
#   - Installs ALL dependencies (including devDependencies)
#   - Generates Prisma client
#   - Compiles TypeScript to JavaScript (tsc)
#
# Stage 2 (production):
#   - Installs ONLY production dependencies
#   - Copies compiled JS and Prisma client from build stage
#   - Runs with plain Node (no tsx, no TypeScript)
#
# This keeps the final image small (~150MB vs ~400MB).
# =============================================

# ----- Stage 1: Build -----
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests first → better Docker layer caching.
# If only source code changes, npm ci is skipped.
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client (needed for compilation).
# Prisma generates a client tailored to your schema.
COPY prisma ./prisma
RUN npx prisma generate

# Copy TypeScript source and compile
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ----- Stage 2: Production -----
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies (smaller image)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma client from build stage
# (node_modules/.prisma contains the generated client)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled JavaScript (dist/ output from tsc)
COPY --from=build /app/dist ./dist

# Create uploads directory for file attachments
RUN mkdir -p uploads

# Expose the port the Express server listens on
EXPOSE 3000

# Start the server with plain Node (not tsx)
CMD ["node", "dist/index.js"]
