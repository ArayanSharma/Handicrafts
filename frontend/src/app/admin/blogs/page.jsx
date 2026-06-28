"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import "../Style/Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] =
    useState("");
  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);
 
const [form, setForm] = useState({
  title: "",
  description: "",
});

const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/blogs"
      );

      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 

 

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };
 

 

 const resetForm = () => {
  setForm({
    title: "",
    description: "",
  });

  setImage(null);
  setPreview("");
}

const openEditModal = (blog) => {
  setEditingId(blog._id);

  setForm({
    title: blog.title || "",
    description: blog.description || "",
  });

  setPreview(blog.image || "");
  setImage(null);

  setShowModal(true);
};

const saveBlog = async (e) => {
  e.preventDefault();

  try {
    const token =
      localStorage.getItem("token");

    const formData = new FormData();

    formData.append(
      "title",
      form.title
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
      ? `http://localhost:5000/api/blogs/${editingId}`
      : "http://localhost:5000/api/blogs";

    const method = editingId
      ? "PUT"
      : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      fetchBlogs();
      setShowModal(false);
      resetForm();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to save blog");
  }
};

  const deleteBlog = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this blog?"
      );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setBlogs((prev) =>
          prev.filter(
            (blog) => blog._id !== id
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBlogs =
    blogs.filter((blog) => {
      const term =
        searchTerm.toLowerCase();

      return (
        blog.title
          ?.toLowerCase()
          .includes(term) ||
        blog.description
          ?.toLowerCase()
          .includes(term)
      );
    });

  if (loading) {
    return (
      <div className="blog-page">
        <h2>Loading Blogs...</h2>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-toolbar">
        <div className="blog-search-wrap">
          <Search
            size={14}
            className="blog-search-icon"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search blogs"
            className="blog-search-input"
          />
        </div>

        <button
          onClick={openAddModal}
          className="blog-add-btn"
        >
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      <div className="blog-card">
        <div className="blog-table-scroll">
          <div className="blog-header">
            <span>Image</span>
            <span>Title</span>
            <span>Description</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-row"
            >
              <span>
                {blog.image ? (
                <img
  src={`http://localhost:5000${blog.image}`}
  alt={blog.title}
  className="blog-thumb"
/>
                ) : (
                  "No Image"
                )}
              </span>

              <span>{blog.title}</span>

              <span className="blog-desc">
                {blog.description}
              </span>

              <span>
                {new Date(
                  blog.createdAt
                ).toLocaleDateString(
                  "en-IN"
                )}
              </span>

              <span className="blog-actions">
                <button
                  className="blog-edit-btn"
                  onClick={() =>
                    openEditModal(blog)
                  }
                >
                  <Edit size={14} />
                </button>

                <button
                  className="blog-delete-btn"
                  onClick={() =>
                    deleteBlog(
                      blog._id
                    )
                  }
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </div>
          ))}

          {filteredBlogs.length ===
            0 && (
            <div className="blog-empty">
              No Blogs Found
            </div>
          )}
        </div>
      </div>

 {showModal && (
  <div className="blog-modal-overlay">
    <div className="blog-modal">
      <div className="blog-modal-header">
        <h2>
          {editingId
            ? "Edit Blog"
            : "Add Blog"}
        </h2>

        <button
          type="button"
          className="blog-close-btn"
          onClick={() =>
            setShowModal(false)
          }
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={saveBlog}
        className="blog-form"
      >
        <div className="blog-form-group">
          <label>
            Blog Title
          </label>

          <input
            type="text"
            placeholder="Enter blog title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            required
          />
        </div>

        <div className="blog-form-group">
          <label>
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file =
                e.target.files[0];

              setImage(file);

              if (file) {
                setPreview(
                  URL.createObjectURL(
                    file
                  )
                );
              }
            }}
          />
        </div>

        {preview && (
          <div className="blog-preview-wrap">
            <img
              src={
                preview.startsWith(
                  "/"
                )
                  ? `http://localhost:5000${preview}`
                  : preview
              }
              alt="Preview"
              className="blog-preview"
            />
          </div>
        )}

        <div className="blog-form-group">
          <label>
            Description
          </label>

          <textarea
            placeholder="Write blog description..."
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
            rows={10}
            required
          />
        </div>

        <div className="blog-modal-footer">
          <button
            type="submit"
            className="blog-save-btn"
          >
            {editingId
              ? "Update Blog"
              : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}