import '../App.css';
import { HashLink as Link } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAuth }  from '../AuthContext/AuthContext';
import { toast } from 'react-toastify';
import { useCart } from '../CartContext/CartContext';

function Header() {
  const navigate = useNavigate();
  const { totalItemsInCart } = useCart();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, login } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const prefix = '+79';

  // 1. Добавляем состояние для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Функция для переключения меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUsernameFocus = () => {
    setIsFocused(true);
    // Нужно чтобы номер телефона всегда начинался с +79 и пользователь не смог никак ввести по другому
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
      navigate('/enter');
    }
    else {
      try {
        await login(username, password);
        navigate('/profile');
      } catch (err) {
        toast.error(`Ошибка входа: ${err.message}`);
    }
    }
    closeModal();
  };


  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/">
        <div className="logotype">
          <svg width="109" height="27" viewBox="0 0 109 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.808 0V22.4H15.712V3.52H4.096V22.4H0V0H19.808Z" fill="#1A1A1A"/>
          <path d="M41.8683 5.312V22.4H38.0602V20.224C37.4202 20.992 36.6203 21.5893 35.6603 22.016C34.7216 22.4213 33.6976 22.624 32.5882 22.624C30.3056 22.624 28.5029 21.9947 27.1803 20.736C25.8576 19.456 25.1963 17.568 25.1963 15.072V5.312H29.1963V14.528C29.1963 16.064 29.5376 17.216 30.2202 17.984C30.9242 18.7307 31.9269 19.104 33.2282 19.104C34.6362 19.104 35.7562 18.6667 36.5882 17.792C37.4416 16.896 37.8683 15.616 37.8683 13.952V5.312H41.8683Z" fill="#1A1A1A"/>
          <path d="M66.022 19.008V26.336H62.278V22.4H47.27V5.312H51.27V19.008H59.43V5.312H63.43V19.008H66.022Z" fill="#1A1A1A"/>
          <path d="M88.3345 19.008V26.336H84.5905V22.4H69.5825V5.312H73.5825V19.008H81.7425V5.312H85.7425V19.008H88.3345Z" fill="#01BBFF"/>
          <path d="M108.535 5.312V22.4H104.727V20.192C104.066 21.0027 103.244 21.6107 102.263 22.016C101.303 22.4213 100.236 22.624 99.063 22.624C97.399 22.624 95.9057 22.2613 94.583 21.536C93.2817 20.8107 92.2577 19.7867 91.511 18.464C90.7857 17.1413 90.423 15.6053 90.423 13.856C90.423 12.1067 90.7857 10.5813 91.511 9.28C92.2577 7.95733 93.2817 6.93333 94.583 6.208C95.9057 5.48267 97.399 5.12 99.063 5.12C100.172 5.12 101.186 5.312 102.103 5.696C103.042 6.08 103.852 6.64533 104.535 7.392V5.312H108.535ZM99.511 19.2C100.983 19.2 102.199 18.7093 103.159 17.728C104.119 16.7467 104.599 15.456 104.599 13.856C104.599 12.256 104.119 10.9653 103.159 9.984C102.199 9.00267 100.983 8.512 99.511 8.512C98.039 8.512 96.823 9.00267 95.863 9.984C94.9243 10.9653 94.455 12.256 94.455 13.856C94.455 15.456 94.9243 16.7467 95.863 17.728C96.823 18.7093 98.039 19.2 99.511 19.2Z" fill="#01BBFF"/>
          </svg>
        </div>
        </Link>

        {/* 3. Добавляем кнопку-гамбургер (иконку) */}
        <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Открыть меню">
          ☰
        </button>

        {/* 4. Используем класс для условного отображения навигации */}
        <nav className={`app-header_nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
          <Link to="/#html_menu">Меню</Link>
          <Link to="/#html_discount">Акции</Link>
          <Link to="/#html_aboutcompany">О компании</Link>
          <Link to="/review">Отзывы</Link>
        </nav>


        {isAuthenticated ? (
        <div className='login'>
          <button className="btn1" onClick={() => navigate('/profile')}>Профиль</button>
        </div>
         )
         : (
        <div className='login'>
          <button className="btn1" onClick={openModal}>Войти</button>
        </div>
        )}
        <Link to="/basket#top-of-basket-page" className="basket_img">
          <img src="basket.png" alt="Корзина"/>
          {totalItemsInCart  > 0 && <span className="basket-count">{totalItemsInCart }</span>}
        </Link>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>

            <form className="login-modal-form" onSubmit={handleSubmit}>
              <h3>Вход или регистрация</h3>
              <div className="name">
                <input className="intxt"
                  ref={inputRef}
                  type="text"
                  placeholder="Телефон"
                  value={username}
                  onChange={handleUsernameChange}
                  maxLength={12}
                  minLength={12}
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameBlur}
                />
                <input className="intxt"
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <button className="btn1" type="submit">Войти</button>

              <div className="login_reg">
                <span>Нет аккаунта?</span>
                <a href="/registration">Зарегистрироваться</a>
              </div>
            </form>
          </div>
        </div>
      )}
   </header>
  );
}

export default Header;