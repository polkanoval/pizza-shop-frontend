import '../App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Basket from './Basket';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


function BasketPage() {
  useEffect(() => {
    // Даем пользователю 1.5 секунды увидеть содержимое корзины
    const timer = setTimeout(() => {
      toast.success("🛒 Почти у цели! На этом этапе можно вводить любые данные карты — это безопасно.", {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        icon: "💳"
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="app-container" id="top-of-basket-page">
        <Header />
        <Basket />
      </div>
      <Footer />
    </>

  );
}

export default BasketPage;