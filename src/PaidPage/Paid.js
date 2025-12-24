import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавили useLocation
import '../App.css';

function Paid() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderNumber = location.state?.orderNumber || "неизвестен";

  return (
    <div className="paid_block">
      <div className="paid">
        <div className="paid_content">
          <div className="success_icon_wrapper">
            <svg className="checkmark" xmlns="www.w3.org" viewBox="0 0 52 52">
              <circle className="checkmark_circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          <h2 className="txt_snd_clr">Заказ успешно оформлен</h2>

          <p className="order_info">
            Номер вашего заказа: <strong>#{orderNumber}</strong>
          </p>

          <button className="btn_back_home" onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}

export default Paid;