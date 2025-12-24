import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://xn--e1afmkfd.website/api/',
  headers: {
    'Content-Type': 'application/json', // стандартный заголовок для всех запросов (отправляем и ожидаем JSON-данные).
  },
});

api.defaults.withCredentials = true; 
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

// Перехватчик запросов
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // прикрепляет токен к исходящему запросу (Profile,Order,Review)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Перехватчик ответов
// Автоматически обновляет просроченный токен, с использованием refresh токена
api.interceptors.response.use(
  (response) => {
    return response; // это если еще не просрочен
  },
  async (error) => {
    const originalRequest = error.config;

    // Токен просрочен и не было запроса на обновление и повторение запроса только один раз
    if (error.response.status === 401 && originalRequest.url !== 'token/refresh/' && !originalRequest._retry) {

      originalRequest._retry = true; // Помечаем запрос как повторенный

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post('https://xn--e1afmkfd.website/api/token/refresh/', { // сам запрос
            refresh: refreshToken
          });

          const newAccessToken = response.data.access;

          // Сохраняем новый токен и обновляем заголовок оригинального запроса
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Повторяем оригинальный запрос с новым токеном
          return axios(originalRequest);

        } catch (refreshError) {
          // Если обновление refresh токена не удалось, разлогиниваем
          console.error("Не удалось обновить токен:", refreshError);
          logoutUser();
          return Promise.reject(refreshError);
        }
      } else {
        // Если refresh токена нет, сразу разлогиниваем
        logoutUser();
        return Promise.reject(error);
      }
    }

    // Для всех остальных ошибок просто пробрасываем их дальше
    return Promise.reject(error);
  }
);

// Вспомогательная функция для разлогинивания и перенаправления
function logoutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.error("Срок действия сессии истек. Пожалуйста, войдите снова.");
}

export default api;