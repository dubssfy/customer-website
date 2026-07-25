import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  XCircle,
  MoreVertical
} from "lucide-react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Once backend is ready, this will fetch from DB
      const response = await api.get("/bookings");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback dummy data for UI display if backend is not running yet
      setOrders([
        { id: 1, customer_name: "Rahul Sharma", service: "Dry Cleaning", city: "Dapoli", status: "Pending", created_at: new Date().toISOString() },
        { id: 2, customer_name: "Priya Singh", service: "Wash & Iron", city: "Khed", status: "Completed", created_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      fetchOrders(); // Refresh
    } catch (error) {
      console.error("Error updating status:", error);
      // Optimistic update for UI if backend fails
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const deleteOrder = async (id) => {
    if(window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        setOrders(orders.filter(o => o.id !== id));
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your laundry bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <ShoppingBag className="stat-icon" />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Users className="stat-icon" />
          </div>
          <div className="stat-details">
            <h3>Pending Orders</h3>
            <p className="stat-value">{pendingOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-details">
            <h3>Completed</h3>
            <p className="stat-value">{completedOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <XCircle className="stat-icon" />
          </div>
          <div className="stat-details">
            <h3>Cancelled</h3>
            <p className="stat-value">{cancelledOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Recent Orders</h2>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Service</th>
                  <th>City</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td className="customer-name">{order.customer_name}</td>
                      <td>{order.service}</td>
                      <td>{order.city}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="dropdown">
                          <button className="action-btn">
                            <MoreVertical size={16} />
                          </button>
                          <div className="dropdown-content">
                            <button onClick={() => updateStatus(order.id, 'Completed')} className="complete-action">Mark Completed</button>
                            <button onClick={() => updateStatus(order.id, 'Cancelled')} className="cancel-action">Cancel Order</button>
                            <button onClick={() => deleteOrder(order.id)} className="delete-action">Delete Order</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
