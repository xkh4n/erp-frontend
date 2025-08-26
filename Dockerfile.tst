# Etapa de build
FROM node:24-alpine3.21 AS builder
WORKDIR /app

# Argumentos de build para configuración
ARG VITE_API_URL=http://localhost:8281/api/1.0
ARG VITE_NODE_ENV=testing
ARG VITE_ENABLE_HTTPS=false
ARG VITE_APP_TITLE="Sistema de Gestión de Inventarios - Testing"

# Variables de entorno para el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_ENABLE_HTTPS=$VITE_ENABLE_HTTPS
ENV VITE_APP_TITLE=$VITE_APP_TITLE

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Etapa final con NGINX
FROM nginx:1.27-alpine3.21-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
