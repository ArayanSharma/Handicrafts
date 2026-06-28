"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

import "../Style/Faqs.css";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/faqs"
      );

      const data = await res.json();

      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      question: "",
      answer: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditingId(faq._id);

    setForm({
      question: faq.question,
      answer: faq.answer,
    });

    setShowModal(true);
  };

  const saveFaq = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      const url = editingId
        ? `http://localhost:5000/api/faqs/${editingId}`
        : "http://localhost:5000/api/faqs";

      const method = editingId
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        fetchFaqs();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to save FAQ");
    }
  };

  const deleteFaq = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this FAQ?"
      );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/faqs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setFaqs((prev) =>
          prev.filter(
            (faq) => faq._id !== id
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) => {
      const term =
        searchTerm.toLowerCase();

      return (
        faq.question
          ?.toLowerCase()
          .includes(term) ||
        faq.answer
          ?.toLowerCase()
          .includes(term)
      );
    }
  );

  if (loading) {
    return (
      <div className="faq-page">
        <h2>Loading FAQs...</h2>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="faq-toolbar">
        <div className="faq-search-wrap">
          <Search
            size={14}
            className="faq-search-icon"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search FAQ..."
            className="faq-search-input"
          />
        </div>

        <button
          className="faq-add-btn"
          onClick={openAddModal}
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      <div className="faq-card">
        <div className="faq-table-scroll">
          <div className="faq-header">
            <span>Question</span>
            <span>Answer</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {filteredFaqs.map((faq) => (
            <div
              key={faq._id}
              className="faq-row"
            >
              <span>
                {faq.question}
              </span>

              <span className="faq-answer">
                {faq.answer}
              </span>

              <span>
                {new Date(
                  faq.createdAt
                ).toLocaleDateString(
                  "en-IN"
                )}
              </span>

              <span className="faq-actions">
                <button
                  className="faq-edit-btn"
                  onClick={() =>
                    openEditModal(faq)
                  }
                >
                  <Edit size={14} />
                </button>

                <button
                  className="faq-delete-btn"
                  onClick={() =>
                    deleteFaq(
                      faq._id
                    )
                  }
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </div>
          ))}

          {filteredFaqs.length ===
            0 && (
            <div className="faq-empty">
              No FAQs Found
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-top">
              <h2>
                {editingId
                  ? "Edit FAQ"
                  : "Add FAQ"}
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveFaq}>
              <input
                type="text"
                placeholder="Question"
                value={form.question}
                onChange={(e) =>
                  setForm({
                    ...form,
                    question:
                      e.target.value,
                  })
                }
                required
              />

              <textarea
                placeholder="Answer"
                value={form.answer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    answer:
                      e.target.value,
                  })
                }
                required
              />

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingId
                    ? "Update FAQ"
                    : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}