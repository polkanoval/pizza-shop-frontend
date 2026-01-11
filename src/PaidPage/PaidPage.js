import '../App.css';
import Header from '../Header/Header';
import Paid from './Paid';
import Footer from '../Footer/Footer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function PaidPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("🎉 Ура, заказ оформлен! Зайдите в Профиль, чтобы увидеть его в истории и оценить работу базы данных.", {
        position: "top-center",
        autoClose: 10000, // Даем больше времени, так как это финал
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        icon: "🏆"
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="app-container">
        <Header />
        <Paid />
      </div>
      <Footer />
    </>

  );
}

export default PaidPage;