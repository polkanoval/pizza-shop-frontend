import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Router>
          <ScrollToTop />
          <AuthProvider>
             <ToastContainer
               position="top-right" // Позиция всплывающих окон
               autoClose={3000}     // Закрывать через 3 секунды
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
      );

}

export default App;