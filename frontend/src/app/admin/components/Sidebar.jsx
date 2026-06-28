"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageSquare,
  FileText,
  HelpCircle,
  Layers3,
  Scissors,
  PlusCircle,
  LogOut,
  Ticket
} from "lucide-react";

import "../Style/Sidebar.css";

/* ── Nav structure with section grouping ──────────── */
const navGroups = [
  {
    section: "Main",
    items: [
      { label: "Overview",    href: "/admin/dashboard",   icon: LayoutDashboard },
      { label: "Customers",   href: "/admin/users",       icon: Users           },
      { label: "Orders",      href: "/admin/orders",      icon: ShoppingBag     },
    ],
  },
  {
    section: "Catalogue",
    items: [
      { label: "Products",    href: "/admin/products",    icon: Package         },
      { label: "Add Product", href: "/admin/addproduct",  icon: PlusCircle      },
      { label: "Categories",  href: "/admin/categories",  icon: Layers3         },
      { label: "Coupons",     href: "/admin/coupons",     icon: Ticket         },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Reviews",     href: "/admin/reviews",     icon: MessageSquare   },
      { label: "Blogs",       href: "/admin/blogs",       icon: FileText        },
      { label: "FAQs",        href: "/admin/faqs",        icon: HelpCircle      },
    ],
  },
];

export default function Sidebar() {
  const pathname           = usePathname();
  const router             = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  /* Read admin name from localStorage for the user chip */
  const [adminName, setAdminName] = useState("Admin");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setAdminName(u.name || u.email?.split("@")[0] || "Admin");
      }
    } catch (_) {}
  }, []);

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Close on Escape key */
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // prevent body scroll on mobile
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  /* Initials for avatar */
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Mobile hamburger toggle ── */}
      <button
        className={`sidebarToggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="main-sidebar"
      >
        <span className="hamburgerLine" />
        <span className="hamburgerLine" />
        <span className="hamburgerLine" />
      </button>

      {/* ── Backdrop (mobile) ── */}
      <div
        className={`sidebarBackdrop ${isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside
        id="main-sidebar"
        className={`sidebar ${isOpen ? "open" : ""}`}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="logo">
           
             <span className="logoText">Creator Handicrafts</span>
            <span className="logoSub">Admin Panel</span>
          
        </div>

        {/* User chip */}
        <div className="sidebarUser">
          <div className="userAvatar">{initials}</div>
          <div className="userInfo">
            <div className="userName">{adminName}</div>
            <div className="userRole">Administrator</div>
          </div>
          <div className="userStatusDot" title="Online" />
        </div>

        {/* Scrollable nav */}
        <div className="sidebarContent">
          <nav className="nav" aria-label="Main navigation">
            {navGroups.map(({ section, items }) => (
              <div key={section}>
                <div className="navSection">{section}</div>
                {items.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`navItem ${isActive ? "navItemActive" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={17} className="navIcon" aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="sidebarFooter">
            <button
              onClick={handleLogout}
              className="logoutBtn"
              aria-label="Log out of admin panel"
            >
              <LogOut size={17} aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}