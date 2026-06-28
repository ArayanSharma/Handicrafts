"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, RefreshCw, Package, Filter } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ALL_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const statusLabel = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusColors = {
  PLACED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-100 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-pink-100 text-pink-700 border-pink-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusDot = {
  PLACED: "bg-yellow-500",
  CONFIRMED: "bg-blue-500",
  PROCESSING: "bg-indigo-500",
  SHIPPED: "bg-pink-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

function resolveImageUrl(rawPath) {
  if (!rawPath) return null;
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) return rawPath;
  return `${API_BASE}${rawPath.startsWith("/") ? rawPath : `/${rawPath}`}`;
}

// ── Filter Dropdown ───────────────────────────────────────────────────────────
function FilterDropdown({ orders, filterStatus, setFilterStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = filterStatus === "ALL" ? "All Orders" : statusLabel[filterStatus];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-black transition"
      >
        <Filter size={14} />
        {current}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden min-w-[200px] py-2">
          <button
            onClick={() => { setFilterStatus("ALL"); setOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 ${
              filterStatus === "ALL" ? "text-black" : "text-gray-600"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              All Orders
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
              {orders.length}
            </span>
          </button>

          <div className="h-px bg-gray-100 mx-3 my-1" />

          {ALL_STATUSES.map((s) => {
            const count = orders.filter((o) => o.orderStatus === s).length;
            return (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 ${
                  filterStatus === s ? "text-black" : "text-gray-600"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${statusDot[s]}`} />
                  {statusLabel[s]}
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Status Action Dropdown ────────────────────────────────────────────────────
function StatusAction({ order, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateStatus = async (newStatus) => {
    setOpen(false);
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/orders/${order._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) onUpdated(order._id, newStatus);
      else alert(data.message || "Update failed");
    } catch {
      alert("Could not update order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={updating}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer hover:opacity-80
          ${statusColors[order.orderStatus]}
          ${updating ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        {updating
          ? <RefreshCw size={10} className="animate-spin" />
          : <span className={`w-1.5 h-1.5 rounded-full ${statusDot[order.orderStatus]}`} />
        }
        {statusLabel[order.orderStatus]}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden min-w-[170px] py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold px-3 pt-1 pb-2">
            Set status to
          </p>
          {ALL_STATUSES.filter((s) => s !== order.orderStatus).map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[s]}`} />
              {statusLabel[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Orders Page ────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      if (data.success) setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const filtered =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">All Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-6 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">All Orders</h2>
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={fetchOrders} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">All Orders</h2>
        <div className="flex flex-col items-center py-20">
          <Package size={56} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-1">No orders yet</h3>
          <p className="text-gray-400 text-sm">Orders will appear here once customers place them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">All Orders ({orders.length})</h2>
        <div className="flex items-center gap-3">
          <FilterDropdown
            orders={orders}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black border border-gray-200 rounded-xl px-4 py-2.5 hover:border-black transition"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">
              No orders with status "{statusLabel[filterStatus]}"
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition">

              {/* Meta */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex flex-wrap gap-5">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Order ID</span>
                    <p className="font-semibold text-sm mt-0.5">#{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Customer</span>
                    <p className="font-semibold text-sm mt-0.5">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : "Guest"}
                    </p>
                    {order.user?.email && (
                      <p className="text-xs text-gray-400">{order.user.email}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Date</span>
                    <p className="font-semibold text-sm mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Amount</span>
                    <p className="font-semibold text-sm mt-0.5">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Payment</span>
                    <p className="font-semibold text-sm mt-0.5">{order.paymentMethod}</p>
                  </div>
                </div>
                <StatusAction order={order} onUpdated={handleStatusUpdated} />
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => {
                  const imageUrl = resolveImageUrl(item.image);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-11 h-11 object-cover rounded-lg border border-gray-200 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping */}
              {order.shippingAddress && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Ship to</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                  </p>
                  <p className="text-sm text-gray-400">
                    {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </p>
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}