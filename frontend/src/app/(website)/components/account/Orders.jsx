"use client";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

const statusLabel = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusColors = {
  PLACED: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-pink-100 text-pink-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.log("Fetch My Orders Error:", err);
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const resolveImageUrl = (rawPath) => {
    if (!rawPath) return null;

    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      return rawPath;
    }

    const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    return `${API_BASE}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-7xl mb-6">📦</div>

          <h3 className="text-2xl font-semibold mb-2">No Orders Yet</h3>

          <p className="text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-8">
        All Orders ({orders.length})
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-sm text-gray-500">Order ID</span>
                <p className="font-semibold">#{order._id.slice(-8)}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Placed On</span>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Amount</span>
                <p className="font-semibold">₹{order.totalPrice}</p>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  statusColors[order.orderStatus] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabel[order.orderStatus] || order.orderStatus}
              </span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => {
                const imageUrl = resolveImageUrl(item.image);

                return (
                  <div key={idx} className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
                        N/A
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}