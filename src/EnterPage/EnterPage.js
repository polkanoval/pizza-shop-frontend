import '../App.css';
import Header from '../Header/Header';
import Enter from './Enter';
import Footer from '../Footer/Footer';

function EnterPage() {
  return (
    <>
      <div className="app-container">
        <Header />
        <Enter />
      </div>
      <Footer />
    </>
  );
}

export default EnterPage;