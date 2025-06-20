import React, { useState } from 'react';
import './App.css';

const menu = [
  { name: "Burger", price: 100 },
  { name: "Pizza", price: 150 },
  { name: "Pasta", price: 120 }
];

function App() {
  const [order, setOrder] = useState(menu.map(item => ({ ...item, quantity: 0 })));
  const [total, setTotal] = useState(null);
  const [message, setMessage] = useState('');

  const updateQuantity = (index, qty) => {
    const newOrder = [...order];
    newOrder[index].quantity = parseInt(qty) || 0;
    setOrder(newOrder);
  };

  const handleSubmit = async () => {
    const itemsToOrder = order.filter(item => item.quantity > 0);
    if (itemsToOrder.length === 0) {
      setMessage("Please select at least one item.");
      return;
    }

    try {
      const res = await fetch("http://localhost/restaurant_api/order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToOrder })
      });

      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Order placed successfully!");
        setTotal(data.total);
      } else {
        setMessage("❌ Failed to place order.");
      }
    } catch (err) {
      setMessage("❌ Error connecting to server.");
    }
  };

  const generateBill = () => {
    const bill = order.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(bill);
    setMessage("💰 Bill generated!");
  };

  return (
    <div className="container">
      <h2 className="heading">🍽️ Restaurant Menu</h2>
      <div className="menu">
        {order.map((item, idx) => (
          <div key={idx} className="menu-item">
            <span className="item-text">{item.name} - ₹{item.price}</span>
            <input
              type="number"
              value={item.quantity}
              min="0"
              className="input"
              onChange={(e) => updateQuantity(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={handleSubmit} className="button-primary">🛒 Submit Order</button>
        <button onClick={generateBill} className="button-secondary">🧾 Generate Bill</button>
      </div>

      {message && <p className="message">{message}</p>}
      {total !== null && <h3 className="total">Total Amount: ₹{total}</h3>}
    </div>
  );
}

export default App;
