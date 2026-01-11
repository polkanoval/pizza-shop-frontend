import '../App.css';
import Header from '../Header/Header';
import Review from './Review';
import Footer from '../Footer/Footer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function ReviewPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("📝 Напишите честный отзыв! Он сразу сохранится в базе, но появится на сайте после того, как я одобрю его в админке Django.", {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        icon: "⚙️"
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="app-container">
        <Header />
        <Review />
      </div>
      <Footer />
    </>

  );
}

export default ReviewPage;