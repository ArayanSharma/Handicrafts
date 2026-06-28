"use client";

import "../../Style/Header.css";
import LoginModal from "../auth/LoginModal";
import SearchBar from "../SearchBar";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import CartSidebar from "../cart/CartSidebar";

export default function Header() {
  const offers = [
    "Extra 5% OFF On Prepaid",
    "50,000+ Happy Customers",
    "Flat 10% OFF on first order | Use Code: FIRSTORDER",
    "Extra 5% OFF On Prepaid",
    "50,000+ Happy Customers",
    "Flat 10% OFF on first order | Use Code: FIRSTORDER",
  ];

  const [currentOffer, setCurrentOffer] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  const updateCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const count = items.reduce(
        (acc, item) => acc + (item.quantity || 1),
        0
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer(
        (prev) => (prev + 1) % offers.length
      );
    }, 3000);

    const openLogin = () => {
      setShowLogin(true);
    };

    window.addEventListener(
      "openLoginModal",
      openLogin
    );

    updateCartCount();

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener(
      "storage",
      updateCartCount
    );

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "openLoginModal",
        openLogin
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );

      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  return (
    <header>

      {/* Top Bar */}

      <div className="topbar">
        <div className="offer-wrapper">
          <div
            key={currentOffer}
            className="offer-slide"
          >
            {offers[currentOffer]}
          </div>
        </div>

        <div className="contact-info">
          <span>+91 701 724 8315</span>
          <span>care@creatorhandicrafts.com</span>
        </div>
      </div>

      {/* Navbar */}

      <div className="navbar">
        <div className="navbar-container">

          {/* Logo */}

          <a href="/">
            <div className="logo">
              <img
                src="/logo.avif"
                alt="Logo"
              />
            </div>
          </a>

          {/* Menu */}

          <nav className="menu">

            {/* Islamic Decor */}

            <div className="menu-item dropdown">
              <span>
                Islamic Decor{" "}
                <ChevronDown size={16} />
              </span>

              <div className="dropdown-menu">

                {/* changed */}

                <a href="/islamicwall-decor">
                  Islamic Wall Art
                </a>

              </div>
            </div>

            {/* Wall Decor */}

            <div className="menu-item dropdown">
              <span>
                Wall Decor{" "}
                <ChevronDown size={16} />
              </span>

              <div className="dropdown-menu">

                <a href="/metal-wall-art">
                  Metal Wall Art
                </a>

                {/* changed */}

                <a href="/wall-clock">
                  Wall Clock
                </a>

                {/* changed */}

                <a href="/mirrors">
                  Decorative Mirrors
                </a>

                <a href="/led-mirrors">
                  LED Mirrors
                </a>

              </div>
            </div>
            {/* Planters */}
            <a href="/planters">Planters</a>

            {/* Furniture */}
            <div className="menu-item dropdown">
              <span>
                Furniture <ChevronDown size={16} />
              </span>

              <div className="dropdown-menu">

                <a href="/furniture">
                  All Furniture
                </a>

                <a href="/coffee-and-center-table">
                  Coffee and Center Table
                </a>

                <a href="/dining-tables">
                  Dining Tables
                </a>

                <a href="/console-tables">
                  Console Tables
                </a>

                <a href="/side-tables">
                  Side Tables
                </a>

                <a href="/serving-trolleys">
                  Serving Trolleys
                </a>

              </div>
            </div>

            {/* Table Decor */}
            <div className="menu-item dropdown">
              <span>
                Table Decor <ChevronDown size={16} />
              </span>

              <div className="dropdown-menu">

                <a href="/brass-showpieces">
                  Brass Showpieces
                </a>

              </div>
            </div>

            {/* Lamps */}
            <div className="menu-item dropdown">
              <span>
                Lamps <ChevronDown size={16} />
              </span>

              <div className="dropdown-menu">

                <a href="/floor-lamps">
                  Floor Lamps
                </a>

                <a href="/table-lamps">
                  Table Lamps
                </a>

              </div>
            </div>

            <div
  className="sale-item"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  }}
>
  <div
    style={{
      position: "relative",
      display: "inline-block",
    }}
  >
    <span
      className="hot-badge"
      style={{
           position: "absolute",
      
        left: "18px",
        backgroundColor: "#e0392b",
        color: "#ffffff",
        fontSize: "8px",
        fontWeight: "700",
         
        borderRadius: "4px",
        letterSpacing: "0.5px",
        display: "inline-block",
      }}
    >
      HOT
    </span>

    {/* pointer/tail */}
    <span
      style={{
        position: "absolute",
        bottom: "1px",
        left: "11px",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "5px solid #e0392b",
      }}
    />
  </div>

  
    <a href="/sale"
    style={{
      fontSize: "18px",
      fontWeight: "700",
      color: "#000000",
      textDecoration: "none",
     
    }}
  >
    Sale
  </a>
</div>

            <a href="/track-order">
              Track Your Orders
            </a>

          </nav>

          {/* Icons */}
          {/* Icons */}
          <div className="icons">

            <Search
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setShowSearch(true)}
            />

            {user ? (
              <a
                href="/account"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User size={20} />
                <span className="text-sm font-medium"></span>
              </a>
            ) : (
              <User
                size={24}
                style={{ cursor: "pointer" }}
                onClick={() => setShowLogin(true)}
              />
            )}

            <div
              className="cart"
              onClick={() => setShowCart(true)}
              style={{ cursor: "pointer" }}
            >
              <ShoppingBag size={20} />

              <span className="cart-count">
                {cartCount}
              </span>
            </div>

          </div>
        </div>
      </div>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />

      <SearchBar
        open={showSearch}
        onClose={() => setShowSearch(false)}
      />

      <CartSidebar
        open={showCart}
        onClose={() => setShowCart(false)}
      />
    </header>
  );
}