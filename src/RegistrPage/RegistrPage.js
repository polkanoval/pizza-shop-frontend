import '../App.css';
import Header from '../Header/Header';
import Registr from './Registr';
import Footer from '../Footer/Footer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function RegistrPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("🔐 Безопасный тест: используйте любой вымышленный номер и пароль. Мы не рассылаем спам!", {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🛡️",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="app-container">
        <Header />
        <Registr />
      </div>
      <Footer />
    </>

  );
}

export default RegistrPage;