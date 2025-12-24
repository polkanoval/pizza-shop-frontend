import '../App.css';
import Header from '../Header/Header';
import Paid from './Paid';
import Footer from '../Footer/Footer';

function PaidPage() {
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