# --- ЭТАП 1: Сборка проекта ---
FROM node:20-alpine AS build
WORKDIR /app

# Сначала копируем только файлы зависимостей (для кэширования слоев)
COPY package*.json ./
RUN npm install

# Копируем остальной код и собираем билд
COPY . .
RUN npm run build

# --- ЭТАП 2: Раздача статики ---
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем 80 порт для веб-трафика
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]