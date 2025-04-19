import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Dashboard.css';

function CustomerDashboard() {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        orderId: '',
        product: '',
        customer: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // WebSocket connection for real-time updates
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                client.subscribe('/topic/order-status', (message) => {
                    const orderUpdate = JSON.parse(message.body);
                    setOrders(prev => [...prev, orderUpdate]);
                });
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [navigate]);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/order/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            setNewOrder({ orderId: '', product: '', customer: '' });
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Customer Dashboard</h1>
            
            <section className="order-form-section">
                <h2>Create New Order</h2>
                <form onSubmit={handleCreateOrder} className="order-form">
                    <div className="form-group">
                        <label htmlFor="orderId">Order ID</label>
                        <input
                            type="text"
                            id="orderId"
                            value={newOrder.orderId}
                            onChange={(e) => setNewOrder({ ...newOrder, orderId: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="product">Product</label>
                        <input
                            type="text"
                            id="product"
                            value={newOrder.product}
                            onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer">Customer</label>
                        <input
                            type="text"
                            id="customer"
                            value={newOrder.customer}
                            onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Create Order</button>
                </form>
            </section>

            <section className="order-status-section">
                <h2>Order Status Updates</h2>
                <div className="status-messages">
                    {orders.map((order, index) => (
                        <div key={index} className={`status-message status-${order.status.toLowerCase()}`}>
                            <p>Order ID: {order.orderId}</p>
                            <p>Status: {order.status}</p>
                            <p>Updated by: {order.updatedBy}</p>
                            <p>Time: {new Date().toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default CustomerDashboard; 