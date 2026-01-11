import { useState, useRef }    from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Registr = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('+79');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleNameChange = (event) => {
    setName(event.target.value);
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
    if (!name.trim()) {
        toast.error('Поле имя пустое!');
        return;
    }

    if (!username.trim() || username.length < 12) { // Проверяем длину номера
        toast.error('Номер телефона должен содержать 10 цифр после +79!');
        return;
    }

    if (!password.trim()) {
        toast.error('Поле пароль пустое!');
        return;
    }

    const formData = {
      first_name: name,
      username: username,
      password: password,
    };

    try {
      await api.post('user/register/', formData);
      await login(username, password); // При успешной регистрации автоматически входит
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      // Редирект используется для Корзины и Отзывов пользователя Гостя
      // После входа перенаправляется обратно для заказа или публикации отзыва
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin'); // Очищаем ключ редиректа
        navigate(redirectPath); // Перенаправляем по ссылке редиректа
      } else {
         toast.success('Регистрация успешна! Вы вошли в систему');
         navigate('/profile'); // Перенаправляем в профиль по умолчанию
      }
    } catch (err) {
         console.error(err.response?.data);

      let errorMessage = 'Произошла ошибка при регистрации.';

      if (err.response && err.response.data) {
        if (err.response.data.username) {
          // Если есть ошибка конкретно для поля username
          errorMessage = `Ошибка: ${err.response.data.username[0]}`;
        } else if (err.response.data.detail) {
          // Если это общая ошибка (например, 401 Unauthorized)
          errorMessage = `Ошибка: ${err.response.data.detail}`;
        }
      }
      toast.error(errorMessage);
      }
  };

  return (
    <form className="profile" onSubmit={handleSubmit}>
         <h2>Регистрация</h2>

         <h3>Имя</h3>
         <div className="profile_edit">
           <input className="infotxt"
             type="text"
             placeholder="Любое имя (хоть 'Тестер' или 'Админ')"
             value={name}
             onChange={handleNameChange}
           />
         </div>

         <h3>Номер телефона</h3>
         <div className="profile_edit">
           <input className="infotxt"
             ref={inputRef}
             type="text"
             inputMode="numeric"
             placeholder= {isFocused ? '' : "Любые цифры (напр. +7999...)"}
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
             placeholder="Придумайте любой простой пароль"
             value={password}
             onChange={handlePasswordChange}
           />
         </div>

         <div className="enter_btns">
           <button className="btn1" type="submit" style={{width:'200px'}} >Зарегистрироваться</button>
         </div>

         <p style={{ fontSize: '11px', color: '#777', textAlign: 'center', marginTop: '10px' }}>
           * Смс-подтверждение отключено для удобства теста.
           <br/>Вводите любые данные!
         </p>
    </form>
   );
  }

  export default Registr;