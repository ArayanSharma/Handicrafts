"use client";

import "../../Style/InspireSection.css";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const videos = [
  {
    video: "/v1.mp4",
    thumb: "/c1.webp",
    title: "Half Moon Metal Wall Clock",
    price: "Rs. 3,200.00",
    oldPrice: "Rs. 7,999.00",
    description:
      "Premium handcrafted wall clock designed with durable metal construction. Perfect for modern homes and office interiors.",
  },
  {
    video: "/v2.mp4",
    thumb: "/c2.webp",
    title: "Ethereal Designer Metal Wall Mirror",
    price: "Rs. 3,999.00",
    oldPrice: "Rs. 7,999.00",
    description:
      "A luxurious decorative wall mirror crafted with premium metal finish. Adds elegance and sophistication to any space.",
  },
  {
    video: "/v3.mp4",
    thumb: "/c3.webp",
    title: "Nesting Coffee Table",
    price: "Rs. 4,999.00",
    oldPrice: "Rs. 8,999.00",
    description:
      "Stylish nesting coffee table designed to maximize space while enhancing your living room décor.",
  },
  {
    video: "/v4.mp4",
    thumb: "/c4.webp",
    title: "Cisco Marble Top Nesting Table",
    price: "Rs. 13,999.00",
    oldPrice: "Rs. 27,000.00",
    description:
      "Luxury marble top nesting table with a modern finish, ideal for contemporary interiors.",
  },
  {
    video: "/v1.mp4",
    thumb: "/c1.webp",
    title: "Designer Wall Clock",
    price: "Rs. 5,999.00",
    oldPrice: "Rs. 9,999.00",
    description:
      "Beautiful designer wall clock crafted with attention to detail and modern aesthetics.",
  },
];

export default function InspireSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  return (
    <section className="inspire-section">
      <div className="inspire-container">

        <div className="inspire-heading">
          <h2>Inspire Your Space</h2>
          <p>TAKE A CLOSER LOOK</p>
        </div>

        <div className="inspire-wrapper">

          <button
            ref={prevRef}
            className="inspire-nav inspire-prev"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            loop
            speed={800}
            spaceBetween={18}
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
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 4,
              },
            }}
          >
            {videos.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="inspire-card"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectedProduct(item)
                  }
                >
                  <video
                    src={item.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="inspire-video"
                  />

                  <div className="inspire-overlay">
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="inspire-thumb"
                    />

                    <div className="inspire-info">
                      <h3>{item.title}</h3>

                      <div className="inspire-prices">
                        <span className="new-price">
                          {item.price}
                        </span>

                        <span className="old-price">
                          {item.oldPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={nextRef}
            className="inspire-nav inspire-next"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>

        {/* Popup */}
{selectedProduct && (
  <div
    onClick={() => setSelectedProduct(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "700px",
        height: "500px",
        background: "#fff",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        position: "relative",
      }}
    >
      {/* Close */}

      <button
        onClick={() => setSelectedProduct(null)}
        style={{
          position: "absolute",
          right: "15px",
          top: "10px",
          border: "none",
          background: "transparent",
          fontSize: "32px",
          cursor: "pointer",
          zIndex: 10,
          color: "#555",
        }}
      >
        ×
      </button>

      {/* Video Side */}

      <div
        style={{
          width: "50%",
          height: "100%",
        }}
      >
        <video
          src={selectedProduct.video}
          autoPlay
          muted
          loop
          playsInline
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Content Side */}

      <div
        style={{
          width: "50%",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#e25d4c",
            color: "#fff",
            width: "60px",
            textAlign: "center",
            padding: "5px",
            borderRadius: "20px",
            fontWeight: 600,
            marginBottom: "15px",
          }}
        >
          -50%
        </div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "1.3",
            marginBottom: "10px",
          }}
        >
          {selectedProduct.title}
        </h2>

        <div
          style={{
            color: "#f4b400",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          ★★★★★
          <span
            style={{
              color: "#666",
              marginLeft: "8px",
            }}
          >
            2 reviews
          </span>
        </div>

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              color: "#14532d",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            {selectedProduct.price}
          </span>

          <span
            style={{
              marginLeft: "10px",
              textDecoration: "line-through",
              color: "#888",
              fontSize: "14px",
            }}
          >
            {selectedProduct.oldPrice}
          </span>
        </div>

        <p
          style={{
            color: "#555",
            fontSize: "14px",
            lineHeight: "1.8",
            marginBottom: "20px",
          }}
        >
          {selectedProduct.description}
        </p>

        <ul
          style={{
            color: "#444",
            fontSize: "14px",
            lineHeight: "2",
            paddingLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <li>
            <strong>Size:</strong> 30 Inches
          </li>
          <li>
            <strong>Material:</strong> Premium Metal
          </li>
          <li>
            <strong>Finish:</strong> Powder Coated
          </li>
        </ul>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "auto",
            alignItems: "center",
          }}
        >
          <button
            style={{
              flex: 1,
              background: "#000",
              color: "#fff",
              border: "none",
              height: "50px",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add To Cart
          </button>

          <button
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ♡
          </button>

          <button
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ⇄
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </section>
  );
}