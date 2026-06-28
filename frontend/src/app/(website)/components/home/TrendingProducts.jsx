"use client";

import "../../Style/NewArrivals.css";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import ProductCard from "../islamicwalll/ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000/api";

export default function NewArrivals() {
  const topPrev = useRef(null);
  const topNext = useRef(null);

  const bottomPrev = useRef(null);
  const bottomNext = useRef(null);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products`
      );

      const data = await res.json();

      if (data.success) {
        const filteredProducts =
          (data.products || []).filter(
            (p) =>
              p.productType ===
              "trending"
          );

        setProducts(
          filteredProducts
        );
      }
    } catch (error) {
      console.log(
        "Product Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const reversedProducts =
    [...products].reverse();

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
        }}
      >
        Loading Products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
        }}
      >
        No Products Found
      </div>
    );
  }

  return (
    <section className="arrival-section">
      <div className="arrival-container">
        <h2 className="arrival-title">
        Trending Products
        </h2>

        {/* TOP ROW */}
        <div className="arrival-row">
          <Swiper
            modules={[
              Autoplay,
              Navigation,
            ]}
            loop
            speed={1000}
            spaceBetween={25}
            navigation={{
              prevEl: topPrev.current,
              nextEl: topNext.current,
            }}
            onBeforeInit={(
              swiper
            ) => {
              swiper.params.navigation.prevEl =
                topPrev.current;

              swiper.params.navigation.nextEl =
                topNext.current;
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
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
            {products.map(
              (product) => (
                <SwiperSlide
                  key={product._id}
                >
                  <Link
                    href={`/productdet/${product._id}`}
                  >
                    <ProductCard
                      image={`http://localhost:5000${product.mainImage}`}
                      hoverImage={
                        product.hoverImage
                          ? `http://localhost:5000${product.hoverImage}`
                          : `http://localhost:5000${product.mainImage}`
                      }
                      title={
                        product.name
                      }
                      price={
                        product.price
                      }
                      discount={
                        product.discount
                      }
                    />
                  </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>

        {/* BOTTOM ROW */}
        <div className="arrival-row">
          <Swiper
            modules={[
              Autoplay,
              Navigation,
              Pagination,
            ]}
            loop
            speed={1000}
            spaceBetween={25}
            navigation={{
              prevEl:
                bottomPrev.current,
              nextEl:
                bottomNext.current,
            }}
            onBeforeInit={(
              swiper
            ) => {
              swiper.params.navigation.prevEl =
                bottomPrev.current;

              swiper.params.navigation.nextEl =
                bottomNext.current;
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
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
            {reversedProducts.map(
              (product) => (
                <SwiperSlide
                  key={product._id}
                >
                  <Link
                    href={`/productdet/${product._id}`}
                  >
                    <ProductCard
                      image={`http://localhost:5000${product.mainImage}`}
                      hoverImage={
                        product.hoverImage
                          ? `http://localhost:5000${product.hoverImage}`
                          : `http://localhost:5000${product.mainImage}`
                      }
                      title={
                        product.name
                      }
                      price={
                        product.price
                      }
                      discount={
                        product.discount
                      }
                    />
                  </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}