"use client";

import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import "../Style/Reviews.css";

const API_URL = "http://localhost:5000";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/reviews`
      );

      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this review?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setReviews((prev) =>
          prev.filter(
            (review) =>
              review._id !== id
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;
  };

  const filteredReviews =
    reviews.filter((review) => {
      const term =
        searchTerm.toLowerCase();

      return (
        review.displayName
          ?.toLowerCase()
          .includes(term) ||
        review.email
          ?.toLowerCase()
          .includes(term) ||
        review.title
          ?.toLowerCase()
          .includes(term) ||
        review.review
          ?.toLowerCase()
          .includes(term)
      );
    });

  if (loading) {
    return (
      <div className="rev-reviews">
        <h2>Loading Reviews...</h2>
      </div>
    );
  }

  return (
    <div className="rev-reviews">
      <div className="rev-toolbar">
        <div className="rev-toolbar-right">
          <div className="rev-search-wrap">
            <Search
              size={14}
              className="rev-search-icon"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search reviews..."
              className="rev-search-input"
            />
          </div>
        </div>
      </div>

      <div className="rev-card">
        <div className="rev-table-scroll">
          <div className="rev-users-header">
            <span>Image</span>
            <span>Reviewer</span>
            <span>Rating</span>
            <span>Title</span>
            <span>Review</span>
            <span>Action</span>
          </div>

          {filteredReviews.map(
            (review) => (
              <div
                key={review._id}
                className="rev-user-row"
              >
                <span>
                  {review.image ? (
                    <img
                      src={getImageUrl(
                        review.image
                      )}
                      alt={
                        review.title
                      }
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit:
                          "cover",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #ddd",
                      }}
                      onError={(
                        e
                      ) => {
                        e.target.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <span>
                      No Image
                    </span>
                  )}
                </span>

                <span>
                  <strong>
                    {
                      review.displayName
                    }
                  </strong>

                  <br />

                  <small>
                    {review.email}
                  </small>
                </span>

                <span className="rev-rating">
                  ⭐{" "}
                  {review.rating}
                </span>

                <span>
                  {review.title}
                </span>

                <span className="rev-review-text">
                  {review.review}
                </span>

                <span>
                  <button
                    className="rev-delete-btn"
                    onClick={() =>
                      deleteReview(
                        review._id
                      )
                    }
                  >
                    <Trash2
                      size={14}
                    />
                    Delete
                  </button>
                </span>
              </div>
            )
          )}

          {filteredReviews.length ===
            0 && (
            <div className="rev-empty-state">
              No reviews found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}