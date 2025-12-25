# --- Этап 1: Сборка проекта ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Убедитесь, что процесс сборки (npm run build) использует REACT_APP_* переменные
RUN npm run build

# --- Этап 2: Продакшн-сервер ---
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ДОБАВЛЕНО: Объявление второго ключа
ARG REACT_APP_YMAPS_JS_API_KEY
ARG REACT_APP_YMAPS_SUGGEST_API_KEY

ENV REACT_APP_YMAPS_JS_API_KEY=$REACT_APP_YMAPS_JS_API_KEY
# ДОБАВЛЕНО: Присвоение второго ключа
ENV REACT_APP_YMAPS_SUGGEST_API_KEY=$REACT_APP_YMAPS_SUGGEST_API_KEY