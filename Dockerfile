FROM node:20.18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npx ng build

# Imagen ligera de nginx para servir la aplicación
FROM nginx:alpine

# Se elimina el contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Se copia el contenido de dist al directorio de nginx
COPY --from=build /app/dist/mi-apr-ng/browser /usr/share/nginx/html

# Se copia el archivo de configuración de nginx al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario angular y grupo nodejs
RUN addgroup -g 1001 -S nodejs && \
    adduser -S angular -u 1001

# Se asignan permisos al usuario angular
RUN chown -R angular:nodejs /usr/share/nginx/html && \
    chown -R angular:nodejs /var/cache/nginx && \
    chown -R angular:nodejs /var/log/nginx && \
    chown -R angular:nodejs /etc/nginx/conf.d

# Cambiar a usuario no root
USER angular

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
