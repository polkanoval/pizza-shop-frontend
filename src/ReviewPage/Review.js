import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../AuthContext/AuthContext';
import api from '../service/api';
import { toast } from 'react-toastify';
import useFetch from "../components/UI/useFetch";
import { useNavigate } from 'react-router-dom';

// Отзыв может оставить только после аутентификации
// После публикации: появится локальным для пользователя на странице и отправится в бд (не опубликованным)
// Чтобы был виден всем, адиминимтратор должен пометить его опубликованным
// Пользователь может удалить только свои отзывы
function Review() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: review, loading, error, setData: setRemoteReviews } = useFetch('review/');
  const [localReviews, setLocalReviews] = useState([]);
// Состояние для хранения данных отзыва, сохраненных в localStorage
  const [pendingReview, setPendingReview] = useState(null);
//Объединение отзывов из двух разных источников
//Сортировка: самые новые отзывы сверху
  const displayedReviews = [...review, ...localReviews].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

  const saveReviewData = (data) => {
    localStorage.setItem('pendingReviewData', JSON.stringify(data));
    // Если Гость, то логика отправить на вход или регистрацию, после входа вернуться к заполненому отзыву
    // Сохраняем текущий путь, куда нужно вернуться после входа
    localStorage.setItem('redirectAfterLogin', '/review');
  };

  // восстанавливаем отзыв после логина
  useEffect(() => {
    const data = localStorage.getItem('pendingReviewData');
    if (data && isAuthenticated) {
        const reviewData = JSON.parse(data);
        setPendingReview(reviewData);

        toast.info("📍 Мы восстановили ваш отзыв. Нажмите «Отправить», чтобы опубликовать его.");
    }
  }, [isAuthenticated]);


  const addReview = async (newReview) => {
    if(user) {
      try {
        // Отправляем новый отзыв на сервер через POST-запрос (api уже имеет токен)
          const response = await api.post('review/', {
          evaluation: newReview.evaluation,
          feedback: newReview.feedback,
        });

        // Сервер вернет полный объект отзыва, включая ID и username автора
        const addedReview = response.data;

        // Добавляем новый отзыв в локальное состояние для мгновенного отображения
        setLocalReviews(prev => [...prev, addedReview]);

        toast.success('🚀 Отзыв отправлен! Он появится в общем списке после модерации.', {
        autoClose: 6000
        });
        // Очищаем localStorage после успешной отправки (т.е user аутентифицирован)
        localStorage.removeItem('pendingReviewData');
        setPendingReview(null);

      } catch (err) {
          if (err.response?.status === 401) {
            toast.error('Ошибка доступа: сессия истекла. Пожалуйста, войдите снова.');
            navigate('/enter');
          } else {
            toast.error('Не удалось добавить отзыв. Возможно, вы не авторизованы.');
          }
          console.error('Ошибка API:', err.response?.data);
      }
    } else {
      saveReviewData(newReview); // Сохраняем введенные данные отзыва перед перенаправлением
      toast.info('🔐 Почти готово! Войдите, чтобы ваш отзыв сохранился в системе.', {
      position: "top-center"
      });
      navigate('/enter'); // Перенаправляем на страницу входа
      return;
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      // Отправляем запрос на удаление по ID
      await api.delete(`review/${reviewId}/delete/`);

      // Обновляем локальное состояние, удаляя отзыв
      setLocalReviews(prev => prev.filter(review => review.id !== reviewId));
      setRemoteReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Отзыв удален.');

    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Не удалось удалить отзыв. Проверьте права доступа.';
      toast.error(errorMessage);
    }
  };

  if (loading) return <p>Загрузка отзывов...</p>;
  if (error) return <p>Ошибка загрузки отзывов.</p>;

  return (
    <div className="review">
      <h2>Отзывы клиентов</h2>
      <div className="review_list">
        {displayedReviews.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserUsername={user?.username}
            onDelete={deleteReview}
          />
       ))}
      </div>
      <div>
        <ReviewForm onAdd={addReview} initialData={pendingReview} />
      </div>
    </div>
  );
}

export default Review;