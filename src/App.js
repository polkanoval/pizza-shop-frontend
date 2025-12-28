import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainPage   from './MainPage/MainPage';
import ReviewPage from './ReviewPage/ReviewPage';
import BasketPage from './BasketPage/BasketPage';
import PaidPage   from './PaidPage/PaidPage';
import ProfilePage   from './ProfilePage/ProfilePage';
import EnterPage   from './EnterPage/EnterPage';
import RegistrPage   from './RegistrPage/RegistrPage';
import { AuthProvider } from './AuthContext/AuthContext';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (

    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/"        element={<MainPage />} />
            <Route path="/review"  element={<ReviewPage />} />
            <Route path="/basket"  element={<BasketPage />} />
            <Route path="/paid"    element={<PaidPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/enter"   element={<EnterPage />} />
            <Route path="/registration"   element={<RegistrPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;