//Централизованное хранилище и логика управления состоянием пользователя
//Хранит информацию о том, аутентифицирован ли пользователь (isAuthenticated), данные профиля (user), и статус загрузки (loading).
import { createContext, useContext, useState,useEffect, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Имитация данных профиля
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Для частичного обновления данных пользователя в Profile
  const updateProfile = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  const logout = useCallback(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/enter');
  }, [navigate]);

  //Загрузка данных пользователя
  const fetchUserProfile = useCallback(async () => {
       try {
         const response = await api.get('user/profile/');
         setUser(response.data);
         setIsAuthenticated(true);
       } catch (error) {
         console.error("Ошибка при загрузке профиля:", error);
         logout();
       }
     }, [logout]);

  useEffect(() => {
    const loadApp = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetchUserProfile();
      }
      setLoading(false);
    };
    loadApp();
  }, [fetchUserProfile]);


  const login = async (username, password) => {
    try {
      // Получаем токены
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Запрашиваем данные профиля
      await fetchUserProfile();

      return response.data;

    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка входа');
    }
  };

  return (
   <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, updateProfile  }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};