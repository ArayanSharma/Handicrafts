"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import "../Style/Topbar.css";

/* ── Page meta ────────────────────────────────────── */
const PAGE_META = {
  "/admin/dashboard":  { title: "Dashboard",   eyebrow: "Overview" },
  "/admin/users":      { title: "Customers",   eyebrow: "People" },
  "/admin/orders":     { title: "Orders",      eyebrow: "Sales" },
  "/admin/products":   { title: "Products",    eyebrow: "Catalogue" },
  "/admin/addproduct": { title: "Add Product", eyebrow: "Catalogue" },
  "/admin/categories": { title: "Categories",  eyebrow: "Catalogue" },
  "/admin/reviews":    { title: "Reviews",     eyebrow: "Content" },
  "/admin/blogs":      { title: "Blogs",       eyebrow: "Content" },
  "/admin/faqs":       { title: "FAQs",        eyebrow: "Content" },
};

export default function Topbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue,    setSearchValue]    = useState("");
  const [adminName,      setAdminName]      = useState("Admin");
  const [hasNotif,       setHasNotif]       = useState(true); // demo

  const profileRef  = useRef(null);
  const searchRef   = useRef(null);
  const searchInput = useRef(null);

  /* Read admin name from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setAdminName(u.name || u.email?.split("@")[0] || "Admin");
      }
    } catch (_) {}
  }, []);

  /* Close dropdown on outside click */
  const handleOutsideClick = useCallback((e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
    // Collapse search on outside click too (mobile)
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      if (!searchValue) setSearchExpanded(false);
    }
  }, [searchValue]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  /* Close dropdown on route change */
  useEffect(() => { setDropdownOpen(false); }, [pathname]);

  /* Focus input when search expands on mobile */
  useEffect(() => {
    if (searchExpanded && searchInput.current) {
      searchInput.current.focus();
    }
  }, [searchExpanded]);

  /* Escape key closes both */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setSearchExpanded(false);
        setSearchValue("");
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const toggleSearch = () => {
    if (searchExpanded && searchValue === "") {
      setSearchExpanded(false);
    } else {
      setSearchExpanded(true);
    }
  };

  const meta     = PAGE_META[pathname] || { title: "Admin Panel", eyebrow: "Creator Handicrafts" };
  const initials = adminName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="topbar" role="banner">
      {/* Signature accent line */}
      <div className="topbar-accent" aria-hidden="true" key={pathname} />

      <div className="topbar-inner">
        {/* ── Left: title ── */}
        <div className="topbar-left">
          <span className="topbar-eyebrow">{meta.eyebrow}</span>
          <h1 className="topbar-title">{meta.title}</h1>
        </div>

 
 

      
      </div>
    </header>
  );
}