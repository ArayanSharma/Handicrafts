"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../Style/EditProduct.css";

const API_URL = "http://localhost:5000/api";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    productType: "none",
    price: "",
    stock: "",
    discount: "",
    availableOffers: "",
    estimatedDelivery: "",
    description: "",
  });

  const [mainPreview, setMainPreview] = useState("");
  const [hoverPreview, setHoverPreview] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${API_URL}/categories`
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products/${params.id}`
      );

      const data = await res.json();

      if (data.success) {
        const product = data.product;

        setForm({
          name: product.name || "",
          category: product.category || "",
          productType: product.productType || "none",
          price: product.price || "",
          stock: product.stock || "",
          discount: product.discount || "",
          availableOffers:
            product.availableOffers || "",
          estimatedDelivery:
            product.estimatedDelivery || "",
          description:
            product.description || "",
        });

        if (product.mainImage) {
          setMainPreview(
            `http://localhost:5000${product.mainImage}`
          );
        }

        if (product.hoverImage) {
          setHoverPreview(
            `http://localhost:5000${product.hoverImage}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("FORM DATA:", form);

    try {
      const res = await fetch(
        `${API_URL}/products/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            productType: form.productType,
            price: form.price,
            stock: form.stock,
            discount: form.discount,
            availableOffers:
              form.availableOffers,
            estimatedDelivery:
              form.estimatedDelivery,
            description:
              form.description,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "UPDATE RESPONSE:",
        data
      );

      if (data.success) {
        alert(
          "Product updated successfully"
        );

        router.push(
          "/admin/products"
        );
      } else {
        alert(
          data.message ||
          "Failed to update product"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <div className="edit-loading">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="edit-wrapper">
      <form
        className="edit-form"
        onSubmit={handleUpdate}
      >
        <h2>Edit Product</h2>

        <div className="edit-field">
          <label>
            Product Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* Category Dropdown */}
        <div className="edit-field">
          <label>
            Category
          </label>

          <select
            value={form.category}
            onChange={(e) => {
              console.log(
                "NEW CATEGORY:",
                e.target.value
              );

              setForm({
                ...form,
                category: e.target.value,
              });
            }}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type Dropdown */}
        <div className="edit-field">
          <label>
            Product Type
          </label>

          <select
            value={form.productType}
            onChange={(e) => {
              setForm({
                ...form,
                productType: e.target.value,
              });
            }}
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

        <div className="edit-row">
          <div className="edit-field">
            <label>
              Price
            </label>

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="edit-field">
            <label>
              Discount
            </label>

            <input
              type="number"
              value={form.discount}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="edit-field">
            <label>
              Stock
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock:
                    e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="edit-field">
          <label>
            Available Offers
          </label>

          <input
            type="text"
            value={
              form.availableOffers
            }
            onChange={(e) =>
              setForm({
                ...form,
                availableOffers:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="edit-field">
          <label>
            Estimated Delivery
          </label>

          <input
            type="text"
            value={
              form.estimatedDelivery
            }
            onChange={(e) =>
              setForm({
                ...form,
                estimatedDelivery:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="edit-field">
          <label>
            Description
          </label>

          <textarea
            rows="5"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />
        </div>

        <div className="edit-images">
          <div>
            <p>Main Image</p>

            {mainPreview && (
              <img
                src={mainPreview}
                alt="Main"
                className="preview-img"
              />
            )}
          </div>

          <div>
            <p>Hover Image</p>

            {hoverPreview && (
              <img
                src={hoverPreview}
                alt="Hover"
                className="preview-img"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="update-btn"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}