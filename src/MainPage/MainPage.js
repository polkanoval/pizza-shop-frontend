import '../App.css';
import Header from '../Header/Header';
import Banner from './Banner';
import Menu from './Menu';
import Discount from './Discount';
import AboutCompany from './AboutCompany';
import Footer from '../Footer/Footer';

function MainPage() {
  return (
    <>
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