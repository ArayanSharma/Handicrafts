"use client";

import { useEffect, useState } from "react";
import "../Style/Categories.css";

const API_URL = "http://localhost:5000/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] =
    useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "slug",
        form.slug
      );

      formData.append(
        "description",
        form.description
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const url = editingId
        ? `${API_URL}/categories/${editingId}`
        : `${API_URL}/categories`;

      const method = editingId
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(
          editingId
            ? "Category Updated"
            : "Category Created"
        );

        setForm({
          name: "",
          slug: "",
          description: "",
        });

        setImage(null);
        setEditingId(null);
        setShowModal(false);

        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (cat) => {
    setEditingId(cat._id);

    setForm({
      name: cat.name,
      slug: cat.slug,
      description:
        cat.description || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(
          "Category Deleted"
        );

        fetchCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="cat-page">
      <div className="cat-header">
        <h1>Categories</h1>

        <button
          className="cat-add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Category
        </button>
      </div>

      <div className="cat-grid">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="cat-card"
          >
            <img
              src={
                cat.image
                  ? `http://localhost:5000${cat.image}`
                  : "/placeholder.jpg"
              }
              alt={cat.name}
              className="cat-image"
            />

            <div className="cat-content">
              <h3>{cat.name}</h3>

              <div className="cat-buttons">
                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(cat)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(cat._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="cat-modal">
          <div className="cat-modal-content">
            <h2>
              {editingId
                ? "Edit Category"
                : "Create Category"}
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Slug"
                value={form.slug}
                readOnly
              />

              <textarea
                placeholder="Description"
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

              <div className="cat-field">
                <label>
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(
                      e.target.files[0]
                    )
                  }
                />
              </div>

              <div className="cat-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}