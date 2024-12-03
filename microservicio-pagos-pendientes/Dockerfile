# Usa una imagen base de Node.js
FROM node:16-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero para optimizar el caché de construcción
COPY package*.json ./

# Instala las dependencias necesarias
RUN npm install

# Copia todo el contenido de tu proyecto al contenedor
COPY . .

# Exponer el puerto desde la variable de entorno o el valor por defecto
ENV PORT=3003

# Exponer el puerto que utiliza el servidor
EXPOSE $PORT

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
