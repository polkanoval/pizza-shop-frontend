import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import { CartProvider } from './CartContext/CartContext';

// Функция для динамической загрузки скрипта Yandex Maps
const addYandexMapScript = () => {
  const script = document.createElement('script');
  const jsApiKey = process.env.REACT_APP_YMAPS_JS_API_KEY;
  const suggestApiKey = process.env.REACT_APP_YMAPS_SUGGEST_API_KEY;

  if (jsApiKey && suggestApiKey) {
    // Собираем URL с использованием переменных окружения
    // script.src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=%REACT_APP_YMAPS_JS_API_KEY%&suggest_apikey=%REACT_APP_YMAPS_SUGGEST_API_KEY%"
    script.src = `https://api-maps.yandex.ru{jsApiKey}&suggest_apikey=${suggestApiKey}`;
    script.type = 'text/javascript';
    document.head.appendChild(script);
  } else {
    console.error("Yandex Maps API keys are missing or not defined during build!");
  }
};

// Вызываем функцию перед рендерингом приложения
addYandexMapScript();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
  </React.StrictMode>
);