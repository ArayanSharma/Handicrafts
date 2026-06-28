"use client";

import "../../Style/ProductCard.css";

export default function ProductCard({
  image,
  hoverImage,
  title,
  price,
  oldPrice,
  discount,
}) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {discount > 0 && (
          <span className="discount-badge">
            -{discount}%
          </span>
        )}

        <img
          src={image}
          alt={title}
          className="product-image main-image"
        />

        <img
          src={hoverImage || image}
          alt={`${title} Hover`}
          className="product-image hover-image"
        />
      </div>

      <h3 className="product-title">
        {title}
      </h3>

      <div className="product-price">
        <span className="sale-price">
          Rs.{" "}
          {Number(
            price || 0
          ).toLocaleString("en-IN")}
        </span>

        {oldPrice > 0 && (
          <span className="old-price">
            Rs.{" "}
            {Number(
              oldPrice
            ).toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </div>
  );
}