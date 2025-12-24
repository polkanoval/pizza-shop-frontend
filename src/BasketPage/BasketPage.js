import '../App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Basket from './Basket';


function BasketPage() {
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