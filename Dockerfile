# --- Этап 1: Сборка проекта ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Этап 2: Продакшн-сервер ---
FROM nginx:stable-alpine

# Копируем билд из первого этапа
COPY --from=build /app/build /usr/share/nginx/html

# Копируем наш УПРОЩЕННЫЙ конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]