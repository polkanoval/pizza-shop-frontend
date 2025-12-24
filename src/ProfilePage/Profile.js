import { useState, useEffect }    from 'react';
import ProfileEdit     from './ProfileEdit';
import { useAuth } from '../AuthContext/AuthContext';
import api from '../service/api';
import { toast } from 'react-toastify';
import { useCart } from '../CartContext/CartContext';
import { ShoppingBag, CreditCard, Calendar } from 'lucide-react';

const Profile = () => {
  const { clearCart } = useCart();

  const { user, loading, logout, updateProfile  } = useAuth();

  const [userData, setUserData] = useState({
    firstName: '',
    phone: '',
    password: "********",
  });
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.first_name || '',
        phone: user.username || '',
        password: "********",
      });
    }
  }, [user]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await api.get('orders/');
        setOrders(response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error.response?.data || error.message);
        toast.error('Не удалось загрузить историю заказов.');
      }
    };
    fetchOrders();
  }, [user]);

  const handleSave = async (fieldName, newValue) => {
    if ((fieldName === 'password' || fieldName === 'first_name') && !newValue) {
      toast.error(`Поле ${fieldName} не может быть пустым.`);
      return;
    }

    toast.info(`Сохранение поля "${fieldName}"...`);

    const updatePayload = { [fieldName]: newValue };

    try {
      await api.patch('user/profile/update/', updatePayload);
      if (fieldName !== 'password') {
        setUserData(prevData => ({
          ...prevData,
          firstName: fieldName === 'first_name' ? newValue : prevData.firstName,
        }));
        updateProfile({ [fieldName]: newValue });
      }
      toast.success(`Поле "${fieldName}" успешно обновлено!`);

    } catch (error) {
      console.error("Ошибка при сохранении:", error.response?.data || error.message);
      toast.error(`Ошибка при сохранении поля "${fieldName}".`);
    }
  };

  const handleLogout = () => {
    clearCart();
    logout();
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (!user) return <p>Данные профиля не найдены.</p>;

  return (
    <div className="profile">
      <h2>Личные данные</h2>
       <h3>Имя</h3>
        <ProfileEdit
                label="first_name"
                fieldName="first_name"
                initialValue={userData.firstName}
                onSave={handleSave}
        />
      <h3>Номер телефона</h3>
        <div className="profile_edit">
          <input className="infotxt"
            type="text"
            value={userData.phone}
            readOnly
          />
        </div>
      <h3>Пароль</h3>
       <ProfileEdit
          label="password"
          fieldName="password"
          initialValue={userData.password}
          onSave={handleSave}
          type="password"
       />
      <div className="enter_btns">
       <button onClick={handleLogout} className="btn1"  >Выйти</button>
      </div>
      <section className="orders">
        <h2 className="profile-section-title">История заказов</h2>

        <div className="orders-filter-bar">
         <button
           className={`filter-tab ${statusFilter === 'all' ? 'active-tab' : ''}`}
           onClick={() => setStatusFilter('all')}
         >
           Все
         </button>
         <button
           className={`filter-tab ${statusFilter === 'active' ? 'active-tab' : ''}`}
           onClick={() => setStatusFilter('active')}
         >
           Активные
         </button>
        </div>
        {orders.length === 0 ? (
          <p>Заказы не найдены.</p>
        ) : (
          <div className="orders-grid">
            {orders
              .filter((o) => {
                if (statusFilter === 'all') return true;
                if (statusFilter === 'active') return o.status !== 'completed';
                return true;
              })
              .map((order) => {
                const statusClass =
                  order.status === 'completed'
                    ? 'status-badge status-completed'
                    : order.status === 'preparing'
                    ? 'status-badge status-preparing'
                    : 'status-badge status-accepted';
                const statusLabel =
                  order.status === 'completed'
                    ? 'Доставлен'
                    : order.status === 'preparing'
                    ? 'В пути'
                    : 'Готовится';

                // Добавляем условный класс 'is-expanded'
                const cardClasses = `order-card ${expandedOrders[order.id] ? 'is-expanded' : ''}`;

                return (
                <article className={cardClasses} key={order.id}>
                  <div className="order-header">
                    <ShoppingBag className="w-5 h-5 order-icon" />
                    <div className="order-title">Заказ #{order.order_number}</div>
                    <span className={statusClass}>{statusLabel}</span>
                  </div>
                  <div className="order-meta">
                    <div className="order-meta order-datetime-container">
                      <Calendar className="w-4 h-4 datetime-icon" />
                      <span>{new Date(order.created_at).toLocaleString('ru-RU')}</span>
                  </div>
                  </div>
                  <div className="order-footer">
                    <CreditCard className="w-5 h-5 total-icon" />
                    <div className="summary-left">Скидка: {order.discount_amount}</div>
                    <div className="summary-right">Итого: {order.final_price}</div>
                  </div>
                  <div className="order-actions">
                    <button className="order-toggle" onClick={() => toggleOrderDetails(order.id)}>
                      {expandedOrders[order.id] ? 'Скрыть детали' : 'Показать детали'}
                    </button>
                  </div>
                  {expandedOrders[order.id] && (
                    <div className="order-section">
                      <ul className="order-items">
                        {Array.isArray(order.items) && order.items.map((item) => (
                          <li key={`${order.id}-${item.pizza}`} className="order-item-row">
                            <span className="order-item-qty">× {item.quantity}</span>
                            <span className="order-item-name">{item.pizza_name}</span>
                            <span className="order-item-price">{item.cost}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;