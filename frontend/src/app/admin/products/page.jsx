"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Package,
  AlertTriangle,
  Edit2,
  Trash2,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";

import "../Style/Products.css";

const API_URL = "http://localhost:5000/api";

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest First" },
  { value: "selling", label: "Best Selling" },
  { value: "stock",   label: "Low Stock First" },
  { value: "price",   label: "Price: High to Low" },
];

const LOW_STOCK = 10;

/* ── Stock badge ──────────────────────────────────── */
function StockLabel({ stock }) {
  if (stock === 0) {
    return (
      <div className="stock-badge stock-badge--out">
        <AlertTriangle size={12} />
        <span>Out of stock</span>
      </div>
    );
  }
  if (stock < LOW_STOCK) {
    return (
      <div className="stock-badge stock-badge--low">
        <AlertTriangle size={12} />
        <span>{stock} left</span>
      </div>
    );
  }
  return (
    <div className="stock-badge stock-badge--available">
      <div className="stock-dot" />
      <span>{stock} in stock</span>
    </div>
  );
}

/* ── Custom confirm modal ─────────────────────────── */
function ConfirmModal({ productName, onConfirm, onCancel, loading }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onCancel]);

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <Trash2 size={24} />
        </div>
        <h3 className="confirm-title">Delete Product?</h3>
        <p className="confirm-text">
          <strong>{productName}</strong> will be permanently removed.
          This action cannot be undone.
        </p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="confirm-btn confirm-btn--delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ────────────────────────────────────────── */
function Toast({ message, type }) {
  return (
    <div className={`toast toast--${type}`}>
      {type === "success"
        ? <CheckCircle size={16} />
        : <XCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}

/* ── Main Component ───────────────────────────────── */
export default function Products() {
  const router = useRouter();
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [sortBy, setSortBy]           = useState("newest");
  const [expanded, setExpanded]       = useState({});
  const [confirmId, setConfirmId]     = useState(null);   // product._id to delete
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting]       = useState(false);
  const [toast, setToast]             = useState(null);   // { message, type }

  /* ── Fetch ── */
  const fetchProducts = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Toast helper ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── Filter & Sort ── */
  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest")  return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "selling") return (b.sold || 0) - (a.sold || 0);
    if (sortBy === "stock")   return a.stock - b.stock;
    return b.price - a.price;
  });

  /* ── Group by category ── */
  const grouped = sorted.reduce((acc, p) => {
    const cat = p.category || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  /* Initialise all categories expanded */
  useEffect(() => {
    const init = {};
    categories.forEach((c) => { init[c] = true; });
    setExpanded(init);
  }, [categories.length]);

  const toggleCategory = (cat) =>
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));

  /* ── Delete flow ── */
  const openConfirm = (id, name) => {
    setConfirmId(id);
    setConfirmName(name);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res  = await fetch(`${API_URL}/products/${confirmId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted", "success");
        fetchProducts();
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleting(false);
      setConfirmId(null);
      setConfirmName("");
    }
  };

  /* ── Stats ── */
  const totalIn  = products.filter((p) => p.stock >= LOW_STOCK).length;
  const totalLow = products.filter((p) => p.stock > 0 && p.stock < LOW_STOCK).length;
  const totalOut = products.filter((p) => p.stock === 0).length;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <div className="products-header-left">
          <div className="products-header-icon">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="products-header-title">Product Management</h1>
            <p className="products-header-subtitle">
              {products.length} products across {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or category…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className="sort-wrapper">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={15} className="sort-icon" />
        </div>
      </div>
{/* Stats Bar */}
<div
  role="status"
  aria-live="polite"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "22px",
    alignItems: "center",
  }}
>
  {/* In Stock */}
  <div
    style={{
      flex: "1 1 220px",
      minWidth: "180px",
      background: "#ffffff",
      border: "1px solid #e8e8e8",
      borderRadius: "14px",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#22c55e",
        flexShrink: 0,
      }}
    />

    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        In Stock
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#111",
          marginTop: "2px",
        }}
      >
        {totalIn}
      </div>
    </div>
  </div>

  {/* Low Stock */}
  <div
    style={{
      flex: "1 1 220px",
      minWidth: "180px",
      background: "#ffffff",
      border: "1px solid #e8e8e8",
      borderRadius: "14px",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#f59e0b",
        flexShrink: 0,
      }}
    />

    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        Low Stock
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#111",
          marginTop: "2px",
        }}
      >
        {totalLow}
      </div>
    </div>
  </div>

  {/* Out of Stock */}
  <div
    style={{
      flex: "1 1 220px",
      minWidth: "180px",
      background: "#ffffff",
      border: "1px solid #e8e8e8",
      borderRadius: "14px",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#ef4444",
        flexShrink: 0,
      }}
    />

    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: "13px",
          color: "#666",
        }}
      >
        Out of Stock
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#111",
          marginTop: "2px",
        }}
      >
        {totalOut}
      </div>
    </div>
  </div>
</div>

      {/* Categories */}
      <div className="categories-section">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={32} />
            </div>
            <h3>No products found</h3>
            <p>
              {searchTerm
                ? `No results for "${searchTerm}" — try a different search.`
                : "Add your first product to get started."}
            </p>
          </div>
        ) : (
          categories.map((cat) => {
            const catProducts = grouped[cat];
            const isExpanded  = expanded[cat];

            return (
              <div key={cat} className="category-group">
                {/* Category header */}
                <div
                  className="category-header"
                  onClick={() => toggleCategory(cat)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleCategory(cat);
                    }
                  }}
                >
                  <div className="category-header-left">
                    <ChevronDown
                      size={18}
                      className={`category-chevron ${isExpanded ? "category-chevron--open" : ""}`}
                    />
                    <h2 className="category-title">{cat}</h2>
                  </div>
                  <div className="category-badge">
                    {catProducts.length} {catProducts.length === 1 ? "product" : "products"}
                  </div>
                </div>

                {/* Product grid */}
                {isExpanded && (
                  <div className="products-grid">
                    {catProducts.map((product) => (
                      <div key={product._id} className="product-card">
                        {/* Image */}
                        <div className="product-image-wrapper">
                          <div className="product-image-container">
                            {product.mainImage ? (
                              <img
                                src={`http://localhost:5000${product.mainImage}`}
                                alt={product.name}
                                className="product-image"
                                loading="lazy"
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                <Package size={36} />
                              </div>
                            )}
                          </div>
                          <StockLabel stock={product.stock} />
                        </div>

                        {/* Info */}
                        <div className="product-info">
                          <h3 className="product-name">{product.name}</h3>

                          <div className="product-price">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </div>

                          {product.description && (
                            <p className="product-description">
                              {product.description.substring(0, 70)}
                              {product.description.length > 70 ? "…" : ""}
                            </p>
                          )}

                          <div className="product-meta">
                            <div className="meta-item">
                              <span className="meta-label">SKU</span>
                              <span className="meta-value">{product.sku || "—"}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Stock</span>
                              <span className="meta-value">{product.stock ?? "—"}</span>
                            </div>
                          </div>

                          <div className="product-actions">
                            <button
                              className="prod-btn prod-btn--edit"
                              onClick={() => router.push(`/admin/editproduct/${product._id}`)}
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit2 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="prod-btn prod-btn--delete"
                              onClick={() => openConfirm(product._id, product.name)}
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirm modal */}
      {confirmId && (
        <ConfirmModal
          productName={confirmName}
          onConfirm={handleDelete}
          onCancel={() => { setConfirmId(null); setConfirmName(""); }}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}