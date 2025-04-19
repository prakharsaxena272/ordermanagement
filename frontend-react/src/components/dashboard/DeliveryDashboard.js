import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Dashboard.css';

function DeliveryDashboard() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
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

    const handleDeliverOrder = async () => {
        try {
            const response = await fetch('http://localhost:8080/order/deliver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ orderId: selectedOrder })
            });

            if (!response.ok) {
                throw new Error('Failed to deliver order');
            }
        } catch (error) {
            console.error('Error delivering order:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Delivery Dashboard</h1>
            
            <section className="order-actions-section">
                <h2>Order Actions</h2>
                <div className="action-form">
                    <div className="form-group">
                        <label htmlFor="orderId">Select Order</label>
                        <select
                            id="orderId"
                            value={selectedOrder}
                            onChange={(e) => setSelectedOrder(e.target.value)}
                            required
                        >
                            <option value="">Select an order</option>
                            {orders
                                .filter(order => order.status === 'SHIPPED')
                                .map(order => (
                                    <option key={order.orderId} value={order.orderId}>
                                        {order.orderId} - {order.product}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <button
                        onClick={handleDeliverOrder}
                        disabled={!selectedOrder}
                        className="action-button deliver-button"
                    >
                        Mark as Delivered
                    </button>
                </div>
            </section>

            <section className="order-status-section">
                <h2>Order Status Updates</h2>
                <div className="status-messages">
                    {orders.map((order, index) => (
                        <div key={index} className={`status-message status-${order.status.toLowerCase()}`}>
                            <p>Order ID: {order.orderId}</p>
                            <p>Product: {order.product}</p>
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

export default DeliveryDashboard; 