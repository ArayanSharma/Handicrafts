"use client";

import "../../Style/HeroBanner.css";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Pagination,
  Navigation,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import h1 from "@/../public/h1.webp";
import h2 from "@/../public/h2.webp";
import h3 from "@/../public/h3.webp";

export default function HeroBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const banners = [h1, h2, h3];

  return (
    <section className="hero-wrapper" >
      <Swiper
        modules={[
          Pagination,
          Navigation,
          Autoplay,
          EffectFade,
        ]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
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
        className="heroSwiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="hero-slide">
              <Image
                src={banner}
                alt={`Banner ${index + 1}`}
                fill
                priority
                className="hero-image"
              />

             <Link href="/furniture">
  <button className="shop-btn">
    Shop Now
  </button>
</Link>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}

        <button
          ref={prevRef}
          className="hero-arrow hero-prev"
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>

        <button
          ref={nextRef}
          className="hero-arrow hero-next"
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </Swiper>
    </section>
  );
}