"use client";

import "../Style/Categoryr.css";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000/api";
const IMAGE_URL = "http://localhost:5000";

export default function Categoryr() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.log("Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert database slug to URL
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
          padding: "40px",
        }}
      >
        Loading Categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
        }}
      >
        No Categories Found
      </div>
    );
  }

  return (
    <section className="category-section">
      <div className="category-container">
        <Swiper
          modules={[
            Autoplay,
            Navigation,
            Pagination,
          ]}
          loop={true}
          speed={1000}
          spaceBetween={35}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl =
              prevRef.current;

            swiper.params.navigation.nextEl =
              nextRef.current;
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
          className="category-swiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link href={getCategoryUrl(category.slug)}>
                <div
                  className="category-card"
                  style={{ cursor: "pointer" }}
                >
                  <div className="category-image">
                    <img
                      src={`${IMAGE_URL}${category.image}`}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <h3>{category.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}

          <button
            ref={prevRef}
            className="category-arrow category-prev"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          <button
            ref={nextRef}
            className="category-arrow category-next"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </Swiper>
      </div>
    </section>
  );
}