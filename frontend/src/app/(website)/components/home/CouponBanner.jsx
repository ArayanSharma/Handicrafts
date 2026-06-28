"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import "../../Style/CouponBanner.css";

export default function CouponBanner() {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    await navigator.clipboard.writeText("FIRSTORDER");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="coupon-section">
      <div className="coupon-container">

        <div
          className="coupon-banner"
          style={{
            backgroundImage: "url('/bg.webp')",
          }}
        >
          <div className="coupon-overlay">

            <div className="coupon-left">
              <h2>
                Get 10% Off Your
                <br />
                First Order!
              </h2>
            </div>

            <div className="coupon-middle">
              Use Code
              <span> "FIRSTORDER" </span>
              at Checkout and Enjoy a Sweet
              Discount on Your First Purchase
            </div>

            <button
              onClick={copyCoupon}
              className="coupon-btn"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  FIRSTORDER
                </>
              )}
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}