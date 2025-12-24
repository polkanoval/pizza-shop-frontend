import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Добавление товара
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Очистка всего товара
  const clearCart = () => {
    setCartItems([]);
  };

 // Функция изменения количества
  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + amount } : item
      ).filter((item) => item.quantity > 0) // Удаляем товар, если количество стало 0
    );
  };

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, updateQuantity, totalItemsInCart }}>
      {children}
    </CartContext.Provider>
  );
};