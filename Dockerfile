# ==============================================================================
# Multi-stage Dockerfile untuk SAVESPEECH Web (React JS + Vite + Tailwind v4)
# Stage 1: Build aplikasi menggunakan Node.js
# Stage 2: Sajikan hasil produksi menggunakan Nginx Alpine yang sangat ringan (<30MB)
# ==============================================================================

# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Salin manifest dependensi terlebih dahulu untuk memanfaatkan Docker layer caching
COPY package.json package-lock.json* ./

# Pasang seluruh dependensi
RUN npm install

# Salin seluruh kode sumber proyek
COPY . .

# Buat build produksi yang dioptimalkan
RUN npm run build

# ─── Stage 2: Production Server ───────────────────────────────────────────────
FROM nginx:alpine AS runner

# Hapus konfigurasi default bawaan Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Salin konfigurasi Nginx kustom untuk dukungan SPA routing & caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin aset statis hasil kompilasi dari Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Port standar HTTP
EXPOSE 80

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
