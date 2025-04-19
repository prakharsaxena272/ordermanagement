import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function WarehouseDashboard() {
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

    const handlePackOrder = async () => {
        try {
            const response = await fetch('http://localhost:8080/order/pack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ orderId: selectedOrder })
            });

            if (!response.ok) {
                throw new Error('Failed to pack order');
            }
        } catch (error) {
            console.error('Error packing order:', error);
        }
    };

    const handleShipOrder = async () => {
        try {
            const response = await fetch('http://localhost:8080/order/ship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ orderId: selectedOrder })
            });

            if (!response.ok) {
                throw new Error('Failed to ship order');
            }
        } catch (error) {
            console.error('Error shipping order:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Warehouse Dashboard</h1>
            
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
                                .filter(order => order.status === 'CREATED' || order.status === 'PACKED')
                                .map(order => (
                                    <option key={order.orderId} value={order.orderId}>
                                        {order.orderId} - {order.status}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="button-group">
                        <button
                            onClick={handlePackOrder}
                            disabled={!selectedOrder}
                            className="action-button pack-button"
                        >
                            Pack Order
                        </button>
                        <button
                            onClick={handleShipOrder}
                            disabled={!selectedOrder}
                            className="action-button ship-button"
                        >
                            Ship Order
                        </button>
                    </div>
                </div>
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

export default WarehouseDashboard; 