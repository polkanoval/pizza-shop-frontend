import '../App.css';
import { useCart } from '../CartContext/CartContext';

function BasketCard({ product }) {
const { updateQuantity } = useCart();

return (
  <div className="basket_cards">
    <div className="basket_card">
      <div className="basket_card_image_container">
          <img src={product.image} alt={product.name} className="basket_card_img"/>
      </div>
      <div className="basket_card_name">
        <h3>Пицца {product.name}</h3>
        <h5 className="txt_prim_clr">36 см</h5>
      </div>
      <div className="basket_card_cnt">
        <button onClick={() => updateQuantity(product.id, -1)} >-</button>
        <span className="product_quantity">{product.quantity}</span>
        <button onClick={() => updateQuantity(product.id, +1)} >+</button>
      </div>
      <h3 className="basket_price" >{product.cost * product.quantity} ₽</h3>
    </div>
  </div>
);
}

export default BasketCard;