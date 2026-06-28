"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const API_BASE = "http://localhost:5000";

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.log("Fetch Addresses Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr._id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || "India",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const url = editingId
        ? `${API_BASE}/api/addresses/${editingId}`
        : `${API_BASE}/api/addresses`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchAddresses();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        fetchAddresses();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/addresses/${id}/set-default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">My Addresses</h2>

        <button
          onClick={openAddModal}
          className="border border-green-700 text-green-700 px-5 py-3 rounded-xl hover:bg-green-700 hover:text-white transition"
        >
          Add New Address
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold">No Address Added</h3>
          <p className="text-gray-500 mt-2">
            You haven't saved any addresses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border rounded-xl p-6">
              {addr.isDefault && (
                <span className="text-sm text-green-700 font-medium">
                  (Default)
                </span>
              )}

              <h3 className="mt-3 text-xl font-semibold">{addr.fullName}</h3>

              <p className="text-gray-600 mt-1">{addr.phone}</p>

              <p className="text-gray-500 mt-2">
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <p className="text-gray-500">{addr.country}</p>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => openEditModal(addr)}
                  className="px-5 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="px-5 py-2 rounded-lg border hover:bg-red-50 text-red-600"
                >
                  Delete
                </button>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="px-5 py-2 rounded-lg border hover:bg-gray-50"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h3 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>

            <div className="space-y-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-green-700 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}