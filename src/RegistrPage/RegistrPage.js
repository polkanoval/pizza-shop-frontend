import '../App.css';
import Header from '../Header/Header';
import Registr from './Registr';
import Footer from '../Footer/Footer';

function RegistrPage() {
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