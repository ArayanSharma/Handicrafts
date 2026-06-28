"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Check, ChevronRight, Edit2, X } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Add / Edit Address Modal ──────────────────────────────────────────────────
function AddressModal({ onClose, onSaved, existing }) {
  const [form, setForm] = useState(
    existing || { fullName: "", phone: "", address: "", city: "", state: "", pincode: "", country: "India" }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const { fullName, phone, address, city, state, pincode } = form;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError("Please fill all fields");
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const url = existing
        ? `${BASE}/api/addresses/${existing._id}`
        : `${BASE}/api/addresses`;
      const method = existing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save address");
      onSaved(data.address);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "fullName", placeholder: "Full Name", col: 1 },
    { name: "phone", placeholder: "Phone Number", col: 1 },
    { name: "address", placeholder: "Complete Address", col: 2, textarea: true },
    { name: "city", placeholder: "City", col: 1 },
    { name: "state", placeholder: "State", col: 1 },
    { name: "pincode", placeholder: "Pincode", col: 1 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {existing ? "Edit Address" : "Add New Address"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ name, placeholder, col, textarea }) =>
            textarea ? (
              <textarea
                key={name}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                rows={3}
                className="col-span-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 resize-none transition"
              />
            ) : (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className={`${col === 2 ? "col-span-2" : ""} w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition`}
              />
            )
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-black text-white py-3 text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Address Picker Modal ──────────────────────────────────────────────────────
function AddressPickerModal({ addresses, selectedId, onSelect, onClose, onAddNew }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900">Choose Address</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {addresses.map((addr) => (
            <button
              key={addr._id}
              onClick={() => { onSelect(addr); onClose(); }}
              className={`w-full text-left rounded-xl border-2 p-4 transition ${
                selectedId === addr._id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">{addr.fullName}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  {addr.isDefault && (
                    <span className="inline-block mt-2 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                {selectedId === addr._id && (
                  <div className="shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center mt-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onAddNew}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-black hover:text-black transition"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>
    </div>
  );
}

// ── Main CheckoutForm ─────────────────────────────────────────────────────────
export default function CheckoutForm({ items, total }) {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Fetch saved addresses on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoadingAddresses(false); return; }
    setIsLoggedIn(true);

    fetch(`${BASE}/api/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAddresses(data.addresses);
          const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
          if (def) setSelectedAddress(def);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAddresses(false));
  }, []);

  // After saving a new/edited address, refresh list
  const handleAddressSaved = (saved) => {
    setAddresses((prev) => {
      const exists = prev.find((a) => a._id === saved._id);
      const updated = exists
        ? prev.map((a) => (a._id === saved._id ? saved : a))
        : [saved, ...prev];
      return updated;
    });
    setSelectedAddress(saved);
    setShowAddModal(false);
    setEditingAddress(null);
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const orderData = {
        items: items.map((item) => ({
          product: item.productId,
          name: item.name,
          image: item.mainImage,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || "India",
        },
        paymentMethod,
        itemsPrice: total,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: total,
      };

      const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order Failed");

      localStorage.removeItem("cartItems");
      router.push(`/checkout/success?id=${data.order._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

        {/* ── Delivery Address Section ── */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Delivery Address</h2>

        {loadingAddresses ? (
          <div className="rounded-2xl border border-gray-200 p-5 animate-pulse bg-gray-50 h-24" />

        ) : !isLoggedIn ? (
          // Guest — show full form fallback
          <GuestAddressForm onAddressReady={setSelectedAddress} />

        ) : addresses.length === 0 ? (
          // No addresses saved yet
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 py-8 text-gray-500 hover:border-black hover:text-black transition"
          >
            <Plus size={20} />
            <span className="font-medium">Add a delivery address to continue</span>
          </button>

        ) : selectedAddress ? (
          // Address selected — show card
          <div className="rounded-2xl border-2 border-black bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedAddress.fullName}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{selectedAddress.phone}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {selectedAddress.address}, {selectedAddress.city},{" "}
                    {selectedAddress.state} — {selectedAddress.pincode}
                  </p>
                  {selectedAddress.isDefault && (
                    <span className="inline-block mt-2 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditingAddress(selectedAddress); setShowAddModal(true); }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black border border-gray-200 rounded-lg px-3 py-1.5 hover:border-black transition"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setShowPicker(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-black border border-black rounded-lg px-3 py-1.5 hover:bg-black hover:text-white transition"
                >
                  Change <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Payment Method ── */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">Payment Method</h3>

          <div className="space-y-4">
            <label
              className={`flex items-center justify-between rounded-2xl border-2 p-5 cursor-pointer transition ${
                paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="w-5 h-5 accent-black"
                />
                <div>
                  <h4 className="font-semibold text-lg">Cash on Delivery</h4>
                  <p className="text-sm text-gray-500">Pay after your order is delivered.</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Available
              </span>
            </label>

            {["UPI", "Credit / Debit Card", "Net Banking"].map((method) => (
              <label
                key={method}
                className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 bg-gray-100 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <input type="radio" disabled className="w-5 h-5" />
                  <h4 className="font-semibold text-lg">{method}</h4>
                </div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Place Order Button ── */}
        <button
          onClick={placeOrder}
          disabled={loading || !selectedAddress}
          className="mt-10 w-full rounded-xl bg-black text-white py-4 text-lg font-semibold transition hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        {!selectedAddress && !loadingAddresses && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Add a delivery address to place your order
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {showPicker && (
        <AddressPickerModal
          addresses={addresses}
          selectedId={selectedAddress?._id}
          onSelect={setSelectedAddress}
          onClose={() => setShowPicker(false)}
          onAddNew={() => { setShowPicker(false); setShowAddModal(true); }}
        />
      )}

      {showAddModal && (
        <AddressModal
          existing={editingAddress}
          onClose={() => { setShowAddModal(false); setEditingAddress(null); }}
          onSaved={handleAddressSaved}
        />
      )}
    </>
  );
}

// ── Guest fallback (not logged in) ───────────────────────────────────────────
function GuestAddressForm({ onAddressReady }) {
  const [form, setForm] = useState({
    fullName: "", phone: "", address: "", city: "", state: "", pincode: "", country: "India",
  });

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    const { fullName, phone, address, city, state, pincode } = updated;
    if (fullName && phone && address && city && state && pincode) onAddressReady(updated);
  };

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[
        { name: "fullName", placeholder: "Full Name" },
        { name: "phone", placeholder: "Phone Number" },
        { name: "city", placeholder: "City" },
        { name: "state", placeholder: "State" },
        { name: "pincode", placeholder: "Pincode" },
      ].map(({ name, placeholder }) => (
        <input
          key={name}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition"
        />
      ))}
      <textarea
        name="address"
        placeholder="Complete Address"
        value={form.address}
        onChange={handleChange}
        rows={3}
        className="md:col-span-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10 resize-none transition"
      />
    </div>
  );
}