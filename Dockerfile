# --- Этап 1: Сборка проекта ---
FROM node:20-alpine AS build
WORKDIR /app

# Объявляем аргументы сборки ДО копирования и установки
ARG REACT_APP_YMAPS_JS_API_KEY
ARG REACT_APP_YMAPS_SUGGEST_API_KEY

# Устанавливаем их как переменные среды для доступа во время npm run build
ENV REACT_APP_YMAPS_JS_API_KEY=$REACT_APP_YMAPS_JS_API_KEY
ENV REACT_APP_YMAPS_SUGGEST_API_KEY=$REACT_APP_YMAPS_SUGGEST_API_KEY

COPY package*.json ./
RUN npm install
RUN npm install --legacy-peer-deps

COPY . .
# Теперь npm run build увидит эти переменные
RUN npm run build

# --- Этап 2: Продакшн-сервер ---
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]