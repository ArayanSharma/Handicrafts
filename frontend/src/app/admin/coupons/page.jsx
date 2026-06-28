"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  perUserLimit: 1,
  expiresAt: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/coupons`, { headers: authHeaders });
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch {
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (c) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || "",
      maxDiscountAmount: c.maxDiscountAmount || "",
      usageLimit: c.usageLimit || "",
      perUserLimit: c.perUserLimit,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
    });
    setEditId(c._id);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue || !form.expiresAt) {
      setError("Code, discount value, and expiry date are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editId ? `${API}/coupons/${editId}` : `${API}/coupons`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setShowModal(false);
      fetchCoupons();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await fetch(`${API}/coupons/${id}/toggle`, {
        method: "PATCH",
        headers: authHeaders,
      });
      fetchCoupons();
    } catch {
      setError("Failed to toggle coupon");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API}/coupons/${deleteId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setDeleteId(null);
      fetchCoupons();
    } catch {
      setError("Failed to delete coupon");
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page { padding: 24px 20px; font-family: 'Inter', sans-serif; color: #2d1a0e; }

        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .header-left h1 { font-size: 26px; font-weight: 700; color: #2d1a0e; }
        .header-left p { font-size: 13px; color: #8a6a55; margin-top: 2px; }

        .btn-primary {
          background: #c8602a; color: #fff; border: none; border-radius: 10px;
          padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #a84e20; }

        /* Stats bar */
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 16px 18px; border: 1px solid #f0e6dc; }
        .stat-card .label { font-size: 12px; color: #8a6a55; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-card .value { font-size: 24px; font-weight: 700; color: #2d1a0e; margin-top: 4px; }

        /* Table card */
        .card { background: #fff; border-radius: 16px; border: 1px solid #f0e6dc; overflow: hidden; }
        .card-header { padding: 18px 20px; border-bottom: 1px solid #f7ece4; font-weight: 600; font-size: 15px; color: #2d1a0e; }

        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 640px; }
        th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #8a6a55; text-transform: uppercase; letter-spacing: 0.05em; background: #fdf7f3; border-bottom: 1px solid #f0e6dc; }
        td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #faf0e8; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fdf7f3; }

        .code-badge { font-family: monospace; font-size: 13px; font-weight: 700; background: #fdf0e6; color: #c8602a; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.08em; display: inline-block; }

        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-active { background: #e6f4ea; color: #2d7a3a; }
        .badge-inactive { background: #f5f5f5; color: #888; }
        .badge-expired { background: #fdecea; color: #c0392b; }

        .toggle-btn { border: none; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .toggle-on { background: #e6f4ea; color: #2d7a3a; }
        .toggle-on:hover { background: #cce8d0; }
        .toggle-off { background: #f5f5f5; color: #888; }
        .toggle-off:hover { background: #e8e8e8; }

        .action-btns { display: flex; gap: 6px; }
        .btn-edit { background: #fdf0e6; color: #c8602a; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-edit:hover { background: #f5dfc8; }
        .btn-delete { background: #fdecea; color: #c0392b; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-delete:hover { background: #f5c6c2; }

        .empty { text-align: center; padding: 60px 20px; color: #8a6a55; }
        .empty svg { margin: 0 auto 12px; display: block; opacity: 0.4; }

        /* Skeleton */
        .skeleton { background: linear-gradient(90deg, #f7ece4 25%, #fdf4ee 50%, #f7ece4 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 6px; height: 16px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Modal */
        .overlay { position: fixed; inset: 0; background: rgba(30,10,5,0.45); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal { background: #fff; border-radius: 20px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 28px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .modal-title { font-size: 20px; font-weight: 700; color: #2d1a0e; margin-bottom: 20px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        label { font-size: 12px; font-weight: 600; color: #5a3a28; text-transform: uppercase; letter-spacing: 0.04em; }
        input, select { border: 1.5px solid #e8d9ce; border-radius: 10px; padding: 10px 12px; font-size: 14px; color: #2d1a0e; background: #fdf7f3; outline: none; transition: border 0.2s; width: 100%; }
        input:focus, select:focus { border-color: #c8602a; background: #fff; }

        .error-msg { background: #fdecea; color: #c0392b; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }

        .modal-footer { display: flex; gap: 10px; margin-top: 22px; justify-content: flex-end; }
        .btn-cancel { background: #f5f0ec; color: #5a3a28; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-cancel:hover { background: #ede4dc; }
        .btn-save { background: #c8602a; color: #fff; border: none; border-radius: 10px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-save:hover { background: #a84e20; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Delete confirm */
        .confirm-modal { background: #fff; border-radius: 16px; padding: 28px; max-width: 380px; width: 100%; text-align: center; }
        .confirm-modal h3 { font-size: 18px; font-weight: 700; color: #2d1a0e; margin-bottom: 8px; }
        .confirm-modal p { font-size: 14px; color: #8a6a55; margin-bottom: 20px; }
        .confirm-btns { display: flex; gap: 10px; justify-content: center; }

        /* Mobile */
        @media (max-width: 600px) {
          .page { padding: 16px 14px; }
          .header-left h1 { font-size: 20px; }
          .form-grid { grid-template-columns: 1fr; }
          .modal { padding: 20px 16px; }
          .modal-footer { flex-direction: column-reverse; }
          .btn-save, .btn-cancel { width: 100%; text-align: center; justify-content: center; }
        }
      `}</style>

      <div className="page">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <h1>Coupons</h1>
            <p>Manage discount codes for your store</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Coupon
          </button>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="label">Total</div>
            <div className="value">{coupons.length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Active</div>
            <div className="value">{coupons.filter(c => c.isActive && !isExpired(c.expiresAt)).length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Expired</div>
            <div className="value">{coupons.filter(c => isExpired(c.expiresAt)).length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Total Used</div>
            <div className="value">{coupons.reduce((a, c) => a + (c.usedCount || 0), 0)}</div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">All Coupons</div>
          <div className="table-wrap">
            {loading ? (
              <div style={{ padding: "20px" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ marginBottom: 14, height: 18, opacity: 1 - i * 0.15 }} />
                ))}
              </div>
            ) : coupons.length === 0 ? (
              <div className="empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c8602a" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <p>No coupons yet. Create your first one!</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Usage</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    const expired = isExpired(c.expiresAt);
                    const statusLabel = expired ? "Expired" : c.isActive ? "Active" : "Inactive";
                    const statusClass = expired ? "badge-expired" : c.isActive ? "badge-active" : "badge-inactive";
                    return (
                      <tr key={c._id}>
                        <td><span className="code-badge">{c.code}</span></td>
                        <td style={{ fontWeight: 600, color: "#c8602a" }}>
                          {c.discountType === "percentage"
                            ? `${c.discountValue}%`
                            : `₹${c.discountValue}`}
                          {c.maxDiscountAmount ? <span style={{ fontSize: 11, color: "#8a6a55", fontWeight: 400, display: "block" }}>max ₹{c.maxDiscountAmount}</span> : null}
                        </td>
                        <td>₹{c.minOrderAmount || 0}</td>
                        <td>
                          {c.usedCount}
                          {c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                        </td>
                        <td style={{ fontSize: 13, color: expired ? "#c0392b" : "#5a3a28" }}>
                          {new Date(c.expiresAt).toLocaleDateString("en-IN")}
                        </td>
                        <td>
                          {!expired ? (
                            <button
                              className={`toggle-btn ${c.isActive ? "toggle-on" : "toggle-off"}`}
                              onClick={() => handleToggle(c._id)}
                            >
                              {c.isActive ? "Active" : "Inactive"}
                            </button>
                          ) : (
                            <span className={`badge ${statusClass}`}>{statusLabel}</span>
                          )}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                            <button className="btn-delete" onClick={() => setDeleteId(c._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">{editId ? "Edit Coupon" : "Create Coupon"}</div>
            {error && <div className="error-msg">{error}</div>}
            <div className="form-grid">
              <div className="form-group full">
                <label>Coupon Code</label>
                <input
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  disabled={!!editId}
                  style={editId ? { opacity: 0.6 } : {}}
                />
              </div>
              <div className="form-group">
                <label>Discount Type</label>
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value</label>
                <input
                  type="number"
                  placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 100"}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Min Order Amount (₹)</label>
                <input type="number" placeholder="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
              </div>
              {form.discountType === "percentage" && (
                <div className="form-group">
                  <label>Max Discount (₹)</label>
                  <input type="number" placeholder="Optional cap" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label>Usage Limit</label>
                <input type="number" placeholder="Blank = unlimited" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Per User Limit</label>
                <input type="number" placeholder="1" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} />
              </div>
              <div className="form-group full">
                <label>Expiry Date</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : editId ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="confirm-modal">
            <h3>Delete Coupon?</h3>
            <p>This action cannot be undone. The coupon will be permanently removed.</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete" style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14 }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}