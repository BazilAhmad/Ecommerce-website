import React, { useState } from 'react'; // Add useState to the import from React
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SearchResults from './components/SearchResults';
import Header from './components/Header';
import ProductDetail from './components/ProductDetail';


function App() {
  const [cartItems, setCartItems] = useState([]);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  // Function to adjust item quantity in the cart
  const updateQuantity = (productId, quantity) => {
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: quantity } : item
    ));
  };
  
  // Checkout functionality placeholder
  const checkout = () => {
    alert('Checkout process initiated!');
    setCartItems([]); // Optionally clear the cart after checkout
  };
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Function to add items to the cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const itemInCart = prevItems.find(item => item.id === product.id);
      if (itemInCart) {
        // If item is already in cart, increase the quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Item not in cart, add the item
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  return (
    
    <Router>
      <div>
      <Header cartItemCount={cartItemCount} />
        <Routes>
          <Route path="/" element={<ProductList addToCart={addToCart} />} />
          <Route path="/products/:productId" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} checkout={checkout} totalPrice={totalPrice} />} />
          <Route path="/search" element={<SearchResults addToCart={addToCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
