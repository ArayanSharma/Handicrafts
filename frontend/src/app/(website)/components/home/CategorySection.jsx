"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import "../../Style/CategorySection.css";

const API_URL = "http://localhost:5000/api";
const IMAGE_URL = "http://localhost:5000";

const CategorySection = () => {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${API_URL}/categories`
      );

      const data = await res.json();

      if (data.success) {
        setCategories(
          data.categories.slice(0, 4)
        );
      }
    } catch (error) {
      console.log(
        "Category Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert database slug to frontend URL
  const getCategoryUrl = (slug = "") => {
    return (
      "/" +
      slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "30px",
        }}
      >
        Loading Categories...
      </div>
    );
  }

  return (
    <section className="category-section">
      <div className="category-container">
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={getCategoryUrl(
                category.slug
              )}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="category-card">
                <div className="category-image">
                  <img
                    src={`${IMAGE_URL}${category.image}`}
                    alt={category.name}
                  />
                </div>

                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;