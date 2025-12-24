import '../App.css';
import Header from '../Header/Header';
import Profile from './Profile';
import Footer from '../Footer/Footer';

function ProfilePage() {
  return (
    <>
      <div className="app-container">
        <Header />
        <Profile />
      </div>
      <Footer />
    </>

  );
}

export default ProfilePage;