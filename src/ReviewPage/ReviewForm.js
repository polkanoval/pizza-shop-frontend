import { useState, useEffect} from 'react';
import { toast } from 'react-toastify';

const ReviewForm = ({ onAdd, initialData }) => {

  const [evaluation, setEval] = useState('');
  const [feedback, setfeedback] = useState('');

  useEffect(() => {
  if (initialData) {
      setEval(initialData.evaluation || '');
      setfeedback(initialData.feedback || '');
    }
  }, [initialData]);

  const handleEvalChange = (event) => {
    setEval(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setfeedback(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Преобразуем оценку в число, т.к. Django ожидает IntegerField
    const evaluationValue = parseInt(evaluation, 10);

    if (isNaN(evaluationValue) || evaluationValue < 1 || evaluationValue > 10) {
      toast.error('Оценка должна быть числом от 1 до 10!');
      return;
    }

    if (feedback.trim().length === 0) {
      toast.error('Поле Отзыв не может быть пустым!');
      return;
    }

    onAdd({
      evaluation: evaluationValue, // Отправляю числовую оценку
      feedback  : feedback.trim()  // Отправляю текст отзыва
    });

    toast.success("🚀 Отправлено! Теперь я увижу ваш отзыв в панели управления.", {
        position: "top-center",
        autoClose: 5000,
    });

    // Очищаю форму
    setEval('');
    setfeedback('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '40px 0px'}}>
      <div className="review_form">
        <h2>Оставь свой отзыв</h2>
        <div className="review_info">
          <input className="infotxt"
            type="number"
            min="1"
            max="10"
            inputMode="numeric"
            placeholder="Оценка (1-10) ⭐"
            value={evaluation}
            onChange={handleEvalChange}
          />
          <input className="infotxt"
            type="text"
            placeholder="Ваш отзыв..."
            value={feedback}
            onChange={handleFeedbackChange}
            maxLength={120}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
          💡 После отправки отзыв попадет в админку Django. Он станет публичным только после моей модерации.
        </p>
      </div>
      <button type="submit" className="btn1">Отправить на модерацию</button>
    </form>
  );
}

export default ReviewForm;