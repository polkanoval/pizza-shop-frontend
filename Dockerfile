# --- Этап 1: Сборка проекта ---
FROM node:20-alpine AS build
WORKDIR /app

# Копируем файлы конфигурации npm
COPY package*.json ./

# Устанавливаем зависимости одним шагом с флагом legacy-peer-deps
# Это исправит ошибку exit code: 1
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Аргументы сборки лучше указывать непосредственно перед командой build
ARG REACT_APP_YMAPS_JS_API_KEY
ARG REACT_APP_YMAPS_SUGGEST_API_KEY

# Передаем их в окружение, чтобы Vite/Webpack подхватил их при компиляции
ENV REACT_APP_YMAPS_JS_API_KEY=$REACT_APP_YMAPS_JS_API_KEY
ENV REACT_APP_YMAPS_SUGGEST_API_KEY=$REACT_APP_YMAPS_SUGGEST_API_KEY

RUN npm run build

# --- Этап 2: Продакшн-сервер ---
FROM nginx:stable-alpine

# ВАЖНО: убедитесь, что папка сборки называется 'build', а не 'dist' (у Vite обычно 'dist')
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]