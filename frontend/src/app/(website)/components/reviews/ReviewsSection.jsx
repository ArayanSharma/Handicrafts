"use client";

import { useEffect, useMemo, useState } from "react";
import "../../Style/Reviews.css";

const API_URL = "http://localhost:5000/api/reviews";

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedReviews = useMemo(() => {
    let sorted = [...reviews];

    switch (sortBy) {
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;

      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;

      case "pictures":
        sorted = sorted.filter(
          (r) => r.image || r.mediaUrl
        );
        break;

      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    return sorted;
  }, [reviews, sortBy]);

  const displayedReviews =
    sortedReviews.slice(0, visibleCount);

  const renderStars = (rating) => {
    return "★".repeat(rating || 5);
  };

  return (
    <section className="reviews-section">
      <div className="reviews-container">

        <div className="reviews-tabs">
          <button
            className={
              activeTab === "reviews"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("reviews")
            }
          >
            Product Reviews (
            {reviews.length})
          </button>

          <button
            className={
              activeTab === "shop"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("shop")
            }
          >
            Shop Reviews
          </button>
        </div>

        <div className="reviews-filter">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="recent">
              Most Recent
            </option>

            <option value="highest">
              Highest Rating
            </option>

            <option value="lowest">
              Lowest Rating
            </option>

            <option value="pictures">
              Only Pictures
            </option>
          </select>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            Loading Reviews...
          </div>
        ) : displayedReviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            No Reviews Found
          </div>
        ) : (
          <div className="reviews-grid">
            {displayedReviews.map(
              (item, index) => (
                <div
                  className="review-card"
                  key={
                    item._id ||
                    item.id ||
                    index
                  }
                >
                  <div className="review-header">
                    <a href="#">
                      about{" "}
                      {item.product?.name ||
                        "Product"}
                    </a>

                    <span>
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="review-stars">
                    {renderStars(
                      item.rating
                    )}
                  </div>

                  <div className="review-user">
                    <div className="avatar">
                      {(
                        item.displayName ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h4>
                        {item.displayName}
                      </h4>

                      <span className="verified">
                        Verified
                      </span>
                    </div>
                  </div>

                 {item.image && (
                  
 <img
  src={
    item.image?.startsWith("http")
      ? item.image
      : `http://localhost:5000${item.image}`
  }
  alt={item.title}
  className="review-image"
/>
)}

                  <h3>
                    {item.title ||
                      "Customer Review"}
                  </h3>

                  <p>
                    {item.review ||
                      item.content}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {visibleCount <
          sortedReviews.length && (
          <div className="load-more-wrap">
            <button
              className="load-more-btn"
              onClick={() =>
                setVisibleCount(
                  (prev) => prev + 6
                )
              }
            >
              Load More Reviews
            </button>
          </div>
        )}

      </div>
    </section>
  );
}