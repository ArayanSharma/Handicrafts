import React from "react";
import "../../Style/TopMarquee.css";

const TopMarquee = () => {
  const items = [
    "BEST QUALITY WITH LOWEST PRICES GUARANTEED",
    "FLAT 10% OFF ON YOUR FIRST PURCHASE",
    "BEST QUALITY WITH LOWEST PRICES GUARANTEED",
    "FLAT 10% OFF ON YOUR FIRST PURCHASE",
  ];

  return (
    <div className="top-marquee">
      <div className="top-marquee-track">
        {[...items, ...items].map((item, index) => (
          <div
            className="top-marquee-item"
            key={index}
          >
            <span>{item}</span>

            <span className="top-marquee-icon">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMarquee;