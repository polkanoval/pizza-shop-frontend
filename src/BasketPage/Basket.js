import '../App.css';
import { useCart } from '../CartContext/CartContext';
import BasketCard from './BasketCard';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';
import api from '../service/api';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext/AuthContext';

function Basket() {
  const { clearCart, cartItems } = useCart();
  const { user } = useAuth();

  // Состояние для хранения результатов расчета с бэкенда
  const [totals, setTotals] = useState({
    total_price_before_discount: 0,
    discount_amount: 0,
    final_price: 0,
    applied_discount_name: null,
    applied_discount_type: null,
    gift_item_id: null,
  });
  const [loadingTotals, setLoadingTotals] = useState(false);

  const [adress, setAddres] = useState('');
  const [apartment, setApartment] = useState('');
  const [cardnum, setCardNum] = useState('');
  const [carddata, setCardData] = useState('');
  const [cardcvc, setCardCvc] = useState('');

  const navigate = useNavigate();

  const handleAdressChange = (event) => setAddres(event.target.value);
  const handleApartmentChange = (e) => {
        setApartment(e.target.value);
    };
  const handleCardNumChange = (event) => {
    const inputCardNum = event.target.value;
    if (/^\d*$/.test(inputCardNum) && inputCardNum.length <= 16) {
      setCardNum(inputCardNum);
    }
  };
  const handleCardDataChange = (event) => setCardData(event.target.value);
  const handleCardCVCChange = (event) => {
    const inputCardCVC = event.target.value;
    if (/^\d*$/.test(inputCardCVC) && inputCardCVC.length <= 3) {
    setCardCvc(inputCardCVC);
    }
  };

  const saveFormData = () => {
    localStorage.setItem('orderFormData', JSON.stringify({
      adress, apartment, cardnum, carddata, cardcvc,
    }))
    // Если Гость, то логика отправить на вход или регистрацию, после входа вернуться
    // Сохраняем текущий путь, куда нужно вернуться после входа
    localStorage.setItem('redirectAfterLogin', '/basket#top-of-basket-page');
  };

  // Для загрузки данных из localStorage при загрузке компонента
  useEffect(() => {
    const savedData = localStorage.getItem('orderFormData');
    if (savedData) {
      const { adress } = JSON.parse(savedData);
      setAddres(adress || '');
      setApartment(apartment || '');
      localStorage.removeItem('orderFormData');
    }
  }, []);

  // Функция для получения предварительного расчета с бэкенда
  const fetchOrderTotals = useCallback(async () => {
    if (cartItems.length === 0) {
      //Сброс, для пустой корзины
      setTotals({
          total_price_before_discount: 0,
          discount_amount: 0,
          final_price: 0,
          applied_discount_name: null,
          applied_discount_type: null,
          gift_item_id: null,
      });
      return; //не вызываю API
    }

    const orderDataForPreview = {
      items: cartItems.map(item => ({
        pizza: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await api.post('order/preview_total/', orderDataForPreview);
      setTotals(response.data);
    } catch (error) {
      console.error('Ошибка при расчете корзины:', error.response.data);
      toast.error('Ошибка при расчете стоимости заказа.');
    } finally {
      setLoadingTotals(false);
    }
  }, [cartItems, setTotals, setLoadingTotals]);

  // Вызываю расчет каждый раз, когда меняются товары в корзине
  useEffect(() => {
    fetchOrderTotals();
  }, [cartItems, fetchOrderTotals]);


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!adress.trim() || !apartment.trim()) {
          alert("Пожалуйста, введите полный адрес и номер квартиры/офиса.");
          return;
      }
    // тут проверяю данные карты для примера, в реальсти будут отправлены на платежный шлюз
    if (cardnum.length !== 16) { toast.error('Номер карты должен содержать 16 цифр!'); return; }
    if (carddata.length !== 5) { toast.error('Дата карты должена содержать 4 цифры!'); return; }
    if (cardcvc.length !== 3) { toast.error('CVC/CVV 3 цифры!'); return; }

    if (!user) {
       saveFormData(); // Сохраняю введенные данные и путь перенаправления
       toast.info('Пожалуйста, войдите или зарегистрируйтесь для оформления заказа.');
       navigate('/enter'); // Перенаправляю на страницу входа
       return;
     }

    const customerName = user.first_name || user.username;
    const fullDeliveryAddress = `${adress}, кв./оф. ${apartment}`;

    const orderData = {
      customer_name: customerName,
      address: fullDeliveryAddress,
      items: cartItems.map(item => ({
          pizza: item.id,
          quantity: item.quantity,
      })),
    };

    try {
       const response = await api.post('order/', orderData);

       console.log('Заказ успешно создан:', response.data);
       const finalPrice = response.data.final_price;
       const orderId = response.data.order_number;
       toast.success(`Ваш заказ #${orderId} принят! Итоговая сумма: ${finalPrice} ₽`);
       navigate('/paid', { state: { orderNumber: orderId } });
       clearCart();

     } catch (error) {
       console.error('Ошибка при оформлении заказа:', error.response.data);
       toast.error('Произошла ошибка при оформлении заказа.');
     }
  };

  const giftItem = totals.gift_item_id
    ? cartItems.find(item => item.id === totals.gift_item_id)
    : null;

  const initializeSuggestView = useCallback(() => {
    if (window.ymaps && document.getElementById("address-input")) {
        const suggestView = new window.ymaps.SuggestView("address-input");
        suggestView.events.add('select', (e) => {
          setAddres(e.get('item').value);
        });
    }
  }, []);

  // Используем useEffect для вызова инициализации после монтирования компонента
  useEffect(() => {
    if (window.ymaps) {
        window.ymaps.ready(initializeSuggestView);
    }
  }, [initializeSuggestView]);


  return (
    <div className="basket_block">
      <div className="basket_product">
        <h2>Корзина</h2>
        {cartItems.length === 0 ? (
            <h4 className="txt_prim_clr">Корзина пуста</h4>
        ) : (
          <div className="basket_products">
            {cartItems.map(product => (
              <BasketCard
                key={product.id}
                product={product}
              />
           ))}
           </div>
            )
        }
        {(loadingTotals || totals.final_price > 0) ? (
                    loadingTotals ? (
                        <h3>Расчет стоимости...</h3>
                    ) : (
                        <div className="basket_total_container">

                            <div className="basket_total_line">

                                <h3 className="basket_total_title">Итого:</h3>

                                <span className="basket_total_new_price">
                                    {totals.final_price} руб.
                                </span>

                                {totals.discount_amount > 0 && (
                                    <span className="basket_total_old_price">
                                        {totals.total_price_before_discount} руб.
                                    </span>
                                )}
                            </div>

                            {totals.discount_amount > 0 && (
                                <div className="basket_total_discount_info">
                                    <p>
                                        🎉 Применена акция: {totals.applied_discount_name}
                                    </p>
                                    {totals.applied_discount_type === 'GIFT_ITEM' && giftItem && (
                                        <p style={{ fontStyle: 'italic' }}>
                                            (🎁 Подарок: "{giftItem.name}" добавлен к заказу бесплатно!)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                ) : null}
    </div>

      {cartItems.length === 0 ? (
            null
        ) : (
            <form onSubmit={handleFormSubmit}>
              <div className="arrangement">
                <h2>Оформление</h2>
                <div>
                  <h3>Адрес доставки </h3>
                  <input className="infotxt" type="text" id="address-input" placeholder="Город/Улица/Дом" value={adress} onChange={handleAdressChange} required/>
                  <input
                      className="infotxt apartment_input"
                      type="text"
                      placeholder="Кв./Офис/Подъезд"
                      value={apartment}
                      onChange={handleApartmentChange}
                      required
                      style={{ marginTop: '10px' }}
                    />
                </div>
              </div>

              <div className="payment">
                <h3>Оплата картой</h3>
                <input className="infotxt"
                  type="text"
                  placeholder="Введите номер карты"
                  value={cardnum}
                  onChange={handleCardNumChange}
                  maxLength={16}
                />
              <div className="cardinfo">
                <PatternFormat className="infotxt"
                  format="##/##"
                  placeholder="MM/ГГ"
                  value={carddata}
                  onChange={handleCardDataChange}
                />
                <input className="infotxt"
                  type="text"
                  placeholder="CVC/CVV"
                  value={cardcvc}
                  onChange={handleCardCVCChange}
                  maxLength={3}
                />
              </div>
              <button className="btn2" type="submit" >Заказать</button>
            </div>
           </form>
        )}
    </div>
  );
}

export default Basket;