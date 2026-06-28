"use client";

import { useState } from "react";
import "../Style/Login.css";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/admin/dashboard";
      } else {
        alert(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── Left Panel ── */}
      <div className="login-panel">
        <div className="login-panel-bg" />
        <div className="login-panel-overlay" />
        <div className="login-panel-grain" />

        <div className="login-panel-content">
          <div className="login-panel-badge">Artisan Admin Portal</div>

          <h2 className="login-panel-heading">
            Crafted with <em>tradition,</em><br />
            managed with precision.
          </h2>

          <div className="login-panel-divider" />

          <p className="login-panel-sub">
            Oversee your handcrafted collections, orders, and artisans —
            all from a single, beautiful dashboard.
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="login-form-side">
        <form className="login-card" onSubmit={handleLogin} noValidate>

          {/* Wordmark */}
          <div className="login-header">
            <div className="login-wordmark">
              <div className="login-wordmark-icon">
                {/* Pottery / flame SVG */}
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C9.5 2 7 4.5 7 7c0 1.8.9 3.4 2 4.5V13H9a1 1 0 000 2h.09C9.56 17.72 11 19.27 11 21a1 1 0 002 0c0-1.73 1.44-3.28 1.91-6H15a1 1 0 000-2h-1v-1.5C15.1 10.4 16 8.8 16 7c0-2.5-1.5-5-4-5z" />
                </svg>
              </div>
              <span className="login-wordmark-text">Creator Handicrafts</span>
            </div>

            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your admin account to continue.</p>
          </div>

          {/* Email field */}
          <div className="login-field">
            <div className="login-field-inner">
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <label className="login-label" htmlFor="email">
                Email Address
              </label>
              {/* Mail icon */}
              <span className="login-field-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Password field */}
          <div className="login-field">
            <div className="login-field-inner">
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <label className="login-label" htmlFor="password">
                Password
              </label>
              {/* Lock icon */}
              <span className="login-field-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="login-forgot">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="login-btn-spinner" />}
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Footer */}
          <div className="login-footer">
            <div className="login-footer-avatar">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"/>
              </svg>
            </div>
            <div className="login-footer-text">
              <strong>Admin Access Only</strong>
              Unauthorised access is strictly prohibited.
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}