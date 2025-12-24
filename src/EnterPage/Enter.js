import { useState, useRef } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Enter = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const prefix = '+79';

 const handleUsernameFocus = () => {
    setIsFocused(true);
    // При фокусе, если значение пустое или только префикс, устанавливаем префикс
    if (username === '' || username === prefix) {
        setUsername(prefix);
    }
  };

  const handleUsernameBlur = (event) => {
    setIsFocused(false);
    // Чтобы было видно placeholder
    if (event.target.value === prefix || !event.target.value.startsWith(prefix)) {
      setUsername('');
    }
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    const regex = /^(\+79)?[\d\s\-()]*$/;
    if (value.match(regex)) {
      setUsername(value);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      if(!username.trim())
        toast.error('Поле номер неверное!');
      else if(!password.trim())
        toast.error('Поле пароль пустое!');
      return;
    }
    else {
      try {
        await login(username, password);
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        // Редирект используется для Корзины и Отзывов пользователя Гостя
        // После входа перенаправляется обратно для заказа или публикации отзыва
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin'); // Очищаем ключ редиректа
          navigate(redirectPath); // Перенаправляем по ссылке редиректа
        } else {
          navigate('/profile'); // Перенаправляем в профиль по умолчанию
        }
      } catch (err) {
        toast.error(`Ошибка входа: ${err.message}`);
      }
    }
  };

  return (
      <form className="profile" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <h3>Номер телефона</h3>
        <div className="profile_edit">
          <input className="infotxt"
            ref={inputRef}
            type="text"
            placeholder= {isFocused ? '' : "Номер телефона"}
            value={username}
            onChange={handleUsernameChange}
            maxLength={12}
            minLength={12}
            onFocus={handleUsernameFocus}
            onBlur ={handleUsernameBlur}
          />
        </div>
        <h3>Пароль</h3>
        <div className="profile_edit">
          <input className="infotxt"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="enter_btns">
          <button className="btn1" type="submit">Вход</button>
          <button className="btn1" type="button" onClick={() => navigate('/registration')}>Регистрация</button>
        </div>
      </form>
  );
}

  export default Enter;