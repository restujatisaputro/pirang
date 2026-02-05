# ===== Build Stage =====
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Run Stage =====
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install prod deps saja
COPY package*.json ./
RUN npm ci --omit=dev

# Copy hasil build + file server yang dibutuhkan
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/services ./services
COPY --from=build /app/metadata.json ./metadata.json

# Kalau server.js butuh file lain, tambahkan COPY-nya juga

EXPOSE 3000
CMD ["node", "server.js"]
