import '../App.css';
import Header from '../Header/Header';
import Review from './Review';
import Footer from '../Footer/Footer';

function ReviewPage() {
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