import '../App.css';
import { Helmet } from 'react-helmet-async'; // 1. Импортируем Helmet
import Header from '../Header/Header';
import Banner from './Banner';
import Menu from './Menu';
import Discount from './Discount';
import AboutCompany from './AboutCompany';
import Footer from '../Footer/Footer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function MainPage() {
  useEffect(() => {
    // Появляется через 2.5 секунды после загрузки
    const timer = setTimeout(() => {
      toast.info("🍕 Добро пожаловать! Это демо-сайт. Смело добавляйте пиццу в корзину и тестируйте заказ с любыми данными!", {
        position: "bottom-right",
        autoClose: 8000, // 8 секунд, чтобы точно успели прочитать
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🚀"
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 2. Настраиваем SEO для Главной страницы */}
      <Helmet>
        <title>Пиццерия "Название" — Доставка вкусной пиццы за 30 минут</title>
        <meta name="description" content="Заказывайте горячую пиццу из натуральных ингредиентов. Скидки новым клиентам, быстрая доставка и большой выбор в нашем меню." />
        <meta name="keywords" content="пицца, доставка пиццы, заказать пиццу, меню пиццерии" />

        {/* Настройки для соцсетей (Open Graph) */}
        <meta property="og:title" content="Пиццерия — Самая вкусная пицца здесь!" />
        <meta property="og:description" content="Посмотрите наше меню и выберите свою любимую пиццу со скидкой." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="vash-domain.ru" />
        {/* Ссылка на картинку, которая будет при репосте (лежит в папке public) */}
        <meta property="og:image" content="vash-domain.ruog-image.jpg" />

        <link rel="canonical" href="vash-domain.ru" />
      </Helmet>

      <div className="app-container" id="top-of-main-page">
        <Header />
        <Banner />
        <Menu />
        <Discount />
        <AboutCompany />
      </div>
      <Footer />
    </>
  );
}

export default MainPage;