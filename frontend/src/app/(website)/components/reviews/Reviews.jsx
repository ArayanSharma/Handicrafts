"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import "../../Style/ReviewSection.css";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/reviews";

export default function ReviewSection() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewImage, setReviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    displayName: "",
    email: "",
  });

  // ✅ fixed: removed the duplicate nested function that was inside itself
  const fetchReviews = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setSuccessMessage("⚠ Please select rating");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("rating", rating);
      form.append("title", formData.title);
      form.append("content", formData.content);
      form.append("displayName", formData.displayName);
      form.append("email", formData.email);

      if (reviewImage) {
        form.append("image", reviewImage);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("✅ Review submitted successfully");

        setFormData({
          title: "",
          content: "",
          displayName: "",
          email: "",
        });

        setReviewImage(null);
        setRating(0);
        fetchReviews();

        setTimeout(() => {
          setSuccessMessage("");
          setShowReviewForm(false);
        }, 3000);
      } else {
        setSuccessMessage(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.log(error);
      setSuccessMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ----- Calculations for summary + breakdown -----
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(2)
      : "0.0";

  // Build counts for 5,4,3,2,1 stars (like official site: 717, 84, 24, 4, 3)
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percent };
  });

  return (
    <section className="review-section">
      <div className="review-container">
        <div className="review-summary">
          {/* LEFT: average score */}
          <div className="review-left">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.round(averageRating) ? "#f5a623" : "transparent"}
                  color="#f5a623"
                />
              ))}
            </div>

            <p className="review-score">
              <strong>{averageRating}</strong> out of 5
            </p>

            <p className="review-based">Based on {totalReviews} reviews</p>
          </div>

          {/* CENTER: star breakdown bars (this was missing) */}
          <div className="review-center">
            {ratingCounts.map(({ star, count, percent }) => (
              <div className="rating-row" key={star}>
                <span className="rating-star">
                  {[...Array(star)].map((_, i) => (
                    <Star key={i} size={12} fill="#f5a623" color="#f5a623" />
                  ))}
                </span>

                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="rating-count">{count}</span>
              </div>
            ))}
          </div>

          {/* RIGHT: write review button */}
          <div className="review-right">
            <button
              className="review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel Review" : "Write a Store Review"}
            </button>
          </div>
        </div>

        {showReviewForm && (
          <form className="store-review-form" onSubmit={handleSubmit}>
            <h2>Write a review</h2>

            {successMessage && (
              <div className="review-success-msg">{successMessage}</div>
            )}

            <div className="rating-select">
              <p>Rating</p>
              <div className="rating-stars-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    onClick={() => setRating(star)}
                    fill={rating >= star ? "#f5a623" : "transparent"}
                    color="#f5a623"
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Review Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Review Content</label>
              <textarea
                rows="6"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Picture (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReviewImage(e.target.files[0])}
              />
              {reviewImage && (
                <img
                  src={URL.createObjectURL(reviewImage)}
                  alt="Preview"
                  className="review-image-preview"
                />
              )}
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="review-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel Review
              </button>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}