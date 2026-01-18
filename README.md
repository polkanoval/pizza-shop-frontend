## Pizza Shop — Frontend

Одностраничное приложение на React для интернет‑пиццерии. Этот README относится только к фронтенду.

### Используемый стек/фреймворк
- **React (Create React App, react-scripts 5)** — сборка и Dev Server
- **React Router v7** — роутинг
- **Axios** — HTTP‑клиент
- **React Context** — `AuthContext`, `CartContext`
- **react-toastify** — уведомления
- **react-helmet-async** — метаданные страницы

### Структура проекта (src/)
- `index.js` — инициализация приложения, подключение скрипта Яндекс.Карт из env
- `App.js` — корневой компонент, провайдеры, маршруты
- `AuthContext/` — аутентификация и хранение токенов
- `CartContext/` — корзина
- `service/api.js` — клиент Axios и перехватчики (refresh токена)
- `components/` — переиспользуемые компоненты и хуки (`components/UI/useFetch.js`, `ScrollToTop.js`)
- `Header/`, `Footer/` — общие секции
- Страницы:
  - `MainPage/` — главная, меню и промо
  - `BasketPage/` — корзина и позиции
  - `PaidPage/` — успешная оплата
  - `ProfilePage/` — профиль и редактирование
  - `EnterPage/`, `RegistrPage/` — вход и регистрация
  - `ReviewPage/` — отзывы

### Скрипты запуска
- Локальная разработка: `npm start`
- Сборка продакшн: `npm run build`
- Тесты: `npm test`

В проекте нет скрипта `npm run dev` (типично для Vite). Для разработки используйте `npm start`.

### Переменные окружения
Create React App требует префикс `REACT_APP_` для переменных, доступных в коде.

- Обязательные для подключения Яндекс.Карт (используются во время сборки):
  - `REACT_APP_YMAPS_JS_API_KEY`
  - `REACT_APP_YMAPS_SUGGEST_API_KEY`

Использование в коде (подключение скрипта Яндекс.Карт):

```9:20:d:/Fullstack/primer/github_pizza-shop-frontend/src/index.js
  const jsApiKey = process.env.REACT_APP_YMAPS_JS_API_KEY;
  const suggestApiKey = process.env.REACT_APP_YMAPS_SUGGEST_API_KEY;
  if (jsApiKey && suggestApiKey) {
    // script.src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=%REACT_APP_YMAPS_JS_API_KEY%&suggest_apikey=%REACT_APP_YMAPS_SUGGEST_API_KEY%"
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey={jsApiKey}&suggest_apikey=${suggestApiKey}`;
  } else {
    console.error("Yandex Maps API keys are missing or not defined during build!");
  }
```

- Подключение к API (бэкенд):
  - Сейчас базовый URL зашит в коде:

```4:8:d:/Fullstack/primer/github_pizza-shop-frontend/src/service/api.js
const api = axios.create({
  baseURL: 'https://xn--e1afmkfd.website/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

  - Если нужно переключать окружения без правки кода, заведите `REACT_APP_API_BASE_URL` и используйте её в `api.js` (не реализовано из коробки).

Пример `.env` для CRA (лежит в корне проекта, рядом с `package.json`):

```bash
REACT_APP_YMAPS_JS_API_KEY=your_js_api_key
REACT_APP_YMAPS_SUGGEST_API_KEY=your_suggest_api_key
# Опционально, если внесёте поддержку в код:
# REACT_APP_API_BASE_URL=https://example.com/api/
```

Важно: для CRA значения env читаются на этапе сборки. После изменения `.env` перезапустите dev‑сервер/пересоберите приложение.

### Быстрый старт
1) Установка зависимостей

```bash
npm install
```

2) Создайте `.env` и заполните ключи Яндекс.Карт

3) Старт dev‑сервера

```bash
npm start
```

4) Сборка продакшн

```bash
npm run build
```

### Docker (опционально)
Dockerfile собирает фронтенд и отдаёт статику через `nginx`. Ключи для Яндекс.Карт передаются как build‑args:

```bash
docker build ^
  --build-arg REACT_APP_YMAPS_JS_API_KEY=your_js_api_key ^
  --build-arg REACT_APP_YMAPS_SUGGEST_API_KEY=your_suggest_api_key ^
  -t pizza-frontend .

docker run -p 8080:80 pizza-frontend
```

Nginx конфиг поддерживает SPA‑роутинг (`try_files ... /index.html`).

### Примечания
- Перехватчики Axios автоматически обновляют `accessToken` по `refreshToken`. При неудаче токены очищаются и показывается уведомление.
- Для смены адреса API без правки кода — добавьте поддержку `REACT_APP_API_BASE_URL` в `src/service/api.js`.