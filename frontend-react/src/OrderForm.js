import React, { useState } from "react";
import "./OrderForm.css";

function OrderForm({ onSubmit }) {
  const [order, setOrder] = useState({
    orderId: "",
    product: "",
    customer: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      onSubmit && onSubmit(order);
      setOrder({ orderId: "", product: "", customer: "" });
    })
    .catch(error => {
      console.error('Error submitting order:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <div className="form-group">
        <label htmlFor="orderId">Order ID</label>
        <input
          id="orderId"
          name="orderId"
          type="text"
          value={order.orderId}
          onChange={handleChange}
          placeholder="Enter Order ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product">Product</label>
        <input
          id="product"
          name="product"
          type="text"
          value={order.product}
          onChange={handleChange}
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="customer">Customer</label>
        <input
          id="customer"
          name="customer"
          type="text"
          value={order.customer}
          onChange={handleChange}
          placeholder="Enter Customer Name"
          required
        />
      </div>

      <button type="submit" className="submit-button">Place Order</button>
    </form>
  );
}

export default OrderForm;