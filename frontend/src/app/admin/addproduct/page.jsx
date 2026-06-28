"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import "../Style/addproduct.css";

const API_URL = "http://localhost:5000/api";

export default function AddProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);

  const [mainPreview, setMainPreview] = useState("");
  const [hoverPreview, setHoverPreview] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    productType: "none",
    price: "",
    discount: "",
    stock: "",
    availableOffers: "",
    estimatedDelivery: "",
    description: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
      });
  }, []);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name"
        ? { slug: generateSlug(value) }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("category", form.category);
      formData.append("productType", form.productType);
      formData.append("price", form.price);
      formData.append("discount", form.discount);
      formData.append("stock", form.stock);
      formData.append(
        "availableOffers",
        form.availableOffers
      );
      formData.append(
        "estimatedDelivery",
        form.estimatedDelivery
      );
      formData.append(
        "description",
        form.description
      );

      if (mainImage) {
        formData.append(
          "mainImage",
          mainImage
        );
      }

      if (hoverImage) {
        formData.append(
          "hoverImage",
          hoverImage
        );
      }

      const res = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);

        alert(
          "Product Added Successfully"
        );

        router.push(
          "/admin/products"
        );
      } else {
        alert(
          data.message ||
          "Failed to create product"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="ap-form"
      onSubmit={handleSubmit}
    >
      <div className="ap-header">
        <h2 className="ap-title">
          Add Product
        </h2>
        <p className="ap-subtitle">
          Create product in MongoDB
        </p>
      </div>

      {submitted && (
        <div className="ap-success">
          <Check size={14} />
          Product created successfully
        </div>
      )}

      <div className="ap-field">
        <label className="ap-label">
          Product Name
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            updateField(
              "name",
              e.target.value
            )
          }
          className="ap-input"
          required
        />
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Category
        </label>

        <select
          value={form.category}
          onChange={(e) =>
            updateField(
              "category",
              e.target.value
            )
          }
          className="ap-input"
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat.slug}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Product Type
        </label>

        <select
          value={form.productType}
          onChange={(e) =>
            updateField(
              "productType",
              e.target.value
            )
          }
          className="ap-input"
        >
          <option value="none">
            None
          </option>
          <option value="newArrival">
            New Arrival
          </option>
          <option value="topSelling">
            Top Selling
          </option>
          <option value="trending">
            Trending
          </option>
        </select>
      </div>

      <div className="ap-row">
        <div className="ap-field">
          <label className="ap-label">
            Price
          </label>

          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              updateField(
                "price",
                e.target.value
              )
            }
            className="ap-input"
            required
          />
        </div>

        <div className="ap-field">
          <label className="ap-label">
            Discount (%)
          </label>

          <input
            type="number"
            value={form.discount}
            onChange={(e) =>
              updateField(
                "discount",
                e.target.value
              )
            }
            className="ap-input"
          />
        </div>

        <div className="ap-field">
          <label className="ap-label">
            Stock
          </label>

          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              updateField(
                "stock",
                e.target.value
              )
            }
            className="ap-input"
            required
          />
        </div>
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Available Offers
        </label>

        <textarea
          rows="3"
          value={form.availableOffers}
          onChange={(e) =>
            updateField(
              "availableOffers",
              e.target.value
            )
          }
          className="ap-textarea"
          placeholder="10% off on first order"
        />
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Estimated Delivery
        </label>

        <input
          type="text"
          value={form.estimatedDelivery}
          onChange={(e) =>
            updateField(
              "estimatedDelivery",
              e.target.value
            )
          }
          className="ap-input"
          placeholder="3-5 Days"
        />
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Main Image *
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files[0];

            setMainImage(file);

            if (file) {
              setMainPreview(
                URL.createObjectURL(
                  file
                )
              );
            }
          }}
          required
        />

        {mainPreview && (
          <img
            src={mainPreview}
            alt="Preview"
            style={{
              width: "120px",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          />
        )}
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Hover Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files[0];

            setHoverImage(file);

            if (file) {
              setHoverPreview(
                URL.createObjectURL(
                  file
                )
              );
            }
          }}
        />

        {hoverPreview && (
          <img
            src={hoverPreview}
            alt="Preview"
            style={{
              width: "120px",
              marginTop: "10px",
              borderRadius: "8px",
            }}
          />
        )}
      </div>

      <div className="ap-field">
        <label className="ap-label">
          Description
        </label>

        <textarea
          rows="5"
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          className="ap-textarea"
          required
        />
      </div>

      <div className="ap-actions">
        <button
          type="submit"
          className="ap-submit-button"
          disabled={loading}
        >
          <Plus size={15} />
          {loading
            ? "Creating..."
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}