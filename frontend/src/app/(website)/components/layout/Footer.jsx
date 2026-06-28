"use client";

import "../../Style/Footer.css"
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top Running Bar */}
      <div className="footer-marquee">
        <div className="footer-marquee-track">
         
          <span><span className="star">✦</span> Free Shipping Within 7 Days</span>
          <span><span className="star">✦</span>  Expert Support Available From 10AM - 6PM</span>
          <span><span className="star">✦</span>  From Our Hands to Your Home- Uniquely Yours</span>

          {/* Duplicate for smooth loop */}
        <span><span className="star">✦</span>  Free Shipping Within 7 Days</span>
          <span><span className="star">✦</span>  Expert Support Available From 10AM - 6PM</span>
          <span><span className="star">✦</span>  From Our Hands to Your Home- Uniquely Yours</span>
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Contact */}
          <div>
            <h3>Contact US</h3>

            <p className="address">
              Address : Lakri Fazalpur,
              Delhi Road, Moradabad,
              Uttar Pradesh - 244001
            </p>

            <p>+91 701 724 8315</p>
            <p>care@creatorhandicrafts.com</p>

            <div className="social-icons">
              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaYoutube />
              </a>

              <a href="#">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3>Quick Links</h3>

            <ul>
              <li><Link href="/">Furniture</Link></li>
              <li><Link href="/">Metal Wall Art</Link></li>
              <li><Link href="/">Table Decor</Link></li>
              <li><Link href="/">Coffee & Center Tables</Link></li>
              <li><Link href="/">Designer Wall Clocks</Link></li>
              <li><Link href="/">Floor Lamps</Link></li>
              <li><Link href="/">Planters</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3>Information</h3>

            <ul>
              <li><Link href="/">WhatsApp Support</Link></li>
              <li><Link href="/">Track Your Order</Link></li>
              <li><Link href="/">Privacy Policy</Link></li>
              <li><Link href="/">Refund Policy</Link></li>
              <li><Link href="/">Shipping Policy</Link></li>
              <li><Link href="/">Terms of Service</Link></li>
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3>Newsletter Signup</h3>

            <p className="newsletter-text">
              Subscribe to our newsletter and get
              10% off your first purchase
            </p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
              />

              <button>
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2024 Creator Handicrafts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}