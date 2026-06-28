"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import "../../Style/ReviewSection.css";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;
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

  const fetchReviews = async () => {
    try {
 const fetchReviews = async () => {
  try {
    const res = await fetch(API_URL);

    const data = await res.json();

    console.log("REVIEWS:", data);

    if (data.success) {
      setReviews(data.reviews);
    }
  } catch (error) {
    console.log(error);
  }
};

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
     setSuccessMessage(
  data.message || "Failed to submit review"
);
      }
    } catch (error) {
      console.log(error);
   setSuccessMessage(
  "❌ Something went wrong"
);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="review-section">
      <div className="review-container">
     

        <div className="review-badges">
          <Image src="/h1.png" alt="Gold" width={90} height={90} />

          <Image src="/h2.png" alt="Silver" width={90} height={90} />
        </div>

      

      
      </div>
    </section>
  );
}
