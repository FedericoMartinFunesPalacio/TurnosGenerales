# =============================================
# Frontend Angular — Multi-stage Dockerfile
# =============================================
#
# Stage 1 (build):
#   - Installs dependencies
#   - Builds Angular app (ng build)
#   - Output goes to dist/frontend/browser/
#
# Stage 2 (production):
#   - Uses Nginx Alpine to serve static files
#   - Copies the built Angular app into Nginx's root
#   - Uses custom nginx.conf for SPA routing + API proxy
#
# The Angular build is pure static files (HTML/CSS/JS),
# so Nginx serves them with no runtime needed.
# =============================================

# ----- Stage 1: Build Angular -----
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests → better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source and build
COPY . .
RUN npm run build

# ----- Stage 2: Serve with Nginx -----
FROM nginx:stable-alpine

# Copy the built Angular app (index.html, JS bundles, CSS)
# Angular 20 outputs to dist/frontend/browser/
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx config:
#   - SPA routing (try_files → index.html)
#   - Proxy /api/* to backend_ts:3000
#   - Proxy /uploads/* to backend_ts:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Start Nginx in foreground (daemon off)
CMD ["nginx", "-g", "daemon off;"]
