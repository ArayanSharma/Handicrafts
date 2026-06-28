"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import ProductCard from "../product/ProductCard";

import "swiper/css";

const products = [
  {
    image: "/p1.png",
    title: "Square Nesting Marble Storage Center Table (Set of 2)",
    price: 12999,
    oldPrice: 27000,
    discount: 52,
  },
  {
    image: "/p2.png",
    title: "Creative Metal Wall Art For Living Room",
    price: 3999,
    oldPrice: 7500,
    discount: 47,
  },
  {
    image: "/p3.png",
    title: "Fabi Ayyi Alai Rabbikuma Tukaziban Islamic Wall Art",
    price: 3999,
    oldPrice: 5500,
    discount: 27,
  },
  {
    image: "/p4.png",
    title: "Mashaallah Tabarakallah Metal Islamic Wall Art",
    price: 2999,
    oldPrice: 5500,
    discount: 45,
  },
  {
    image: "/p1.png",
    title: "Luxury Metal Wall Decor",
    price: 3499,
    oldPrice: 6999,
    discount: 50,
  },
];

const RelatedProducts = () => {
  return (
    <section className="py-16 bg-[#f5f5f5] text-black">
      <div className="max-w-[1800px] mx-auto px-5">
        <h2 className="text-center text-5xl font-bold mb-12">
          Related Products
        </h2>

        <Swiper
          modules={[Autoplay]}
          loop={true}
          spaceBetween={25}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2.5,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RelatedProducts;