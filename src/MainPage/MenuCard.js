import '../App.css';
import { useCart } from '../CartContext/CartContext';

function MenuCard ({ product }) {
  const {addToCart, updateQuantity , cartItems } = useCart();
  const cartItem = cartItems.find(item => item.id === product.id);

return (
   <div className="menu_block">
      <h3>{product.name}</h3>
      <div className="menu_add">
        <div className="elm">{product.cost} ₽</div>
        { cartItem ?
        (
        <div className="quantity-controls">
          <button onClick={() => updateQuantity(product.id, -1)} className="btn3">-</button>
          <span className="quantity-display">{cartItem.quantity}</span>
          <button onClick={() => updateQuantity(product.id, +1)} className="btn3">+</button>
        </div>
        )
        :         (
        <button className="btn2" onClick={() => addToCart(product)}>Добавить</button>)

        }
      </div>
      <img  src={product.image} className="menu_img" alt={product.image}/>
      <p className="menu_description">{product.description}</p>
    </div>
);
}

export default MenuCard;