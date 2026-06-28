"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({
  children,
}) {
  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 768
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <div className="adminLayout">
      <Sidebar />

      <div
        style={{
          marginLeft: isMobile
            ? "0"
            : "260px",
          width: isMobile
            ? "100%"
            : "calc(100% - 260px)",
          minHeight: "100vh",
          background: "#f8f8f8",
          transition:
            "all 0.3s ease",
        }}
      >
        <Topbar />

        <main
          style={{
            padding: isMobile
              ? "15px"
              : "20px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}