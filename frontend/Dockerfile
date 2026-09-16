# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Estágio 2: Servidor Nginx
FROM nginx:alpine
# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Angular (ATENÇÃO: ajuste 'boebel-games' para o nome exato da pasta que o seu Angular gera dentro de dist/)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Configuração para servir o Angular e redirecionar a API
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:8080; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
