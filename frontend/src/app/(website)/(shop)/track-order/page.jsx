"use client";

import "../../Style/Trackorder.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function AccountPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  const [isRegister, setIsRegister] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  const [registerData, setRegisterData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/account");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${BASE}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.push("/account");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${BASE}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            registerData
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Registration failed"
        );
      }

      alert(
        "Account created successfully. Please login."
      );

      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      setIsRegister(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="container">

        {/* Breadcrumb */}

        <div className="breadcrumb">
          <span>Home</span>
          <span className="dot">•</span>
          <span className="active">
            Account
          </span>
        </div>

        {/* Heading */}

        <div className="page-header">
          <h1>
            Create account to track your
            orders
          </h1>

          <p>
            <strong>Note :</strong>
            {" "}
            First-time buyer? Create your
            account in simple steps to
            manage and track your orders
            easily.
          </p>
        </div>

        <div className="account-wrapper">

          {/* Login */}

          <div className="login-section">

            <h2>Login</h2>

            <form onSubmit={login}>

              <input
                type="email"
                name="email"
                placeholder="Your email*"
                className="input-field"
                value={loginData.email}
                onChange={
                  handleLoginChange
                }
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password*"
                className="input-field"
                value={
                  loginData.password
                }
                onChange={
                  handleLoginChange
                }
                required
              />

              <a
                href="#"
                className="forgot-password"
              >
                Forgot your password?
              </a>

              <button
                type="submit"
                className="black-btn"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </form>

          </div>

          {/* Create Account */}

          <div className="register-section">

            <h2>Create Account</h2>

            {!isRegister ? (
              <>
                <p>
                  Create your account in
                  simple steps to manage
                  and track your orders
                  easily.
                </p>

                <button
                  className="black-btn"
                  onClick={() =>
                    setIsRegister(true)
                  }
                >
                  Sign up
                </button>
              </>
            ) : (
              <form onSubmit={register}>

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="input-field"
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                  required
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="input-field"
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input-field"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input-field"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />

                <button
                  type="submit"
                  className="black-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <button
                  type="button"
                  className="black-btn"
                  style={{
                    background: "#fff",
                    color: "#000",
                    border: "1px solid #000",
                    marginTop: "15px",
                  }}
                  onClick={() =>
                    setIsRegister(false)
                  }
                >
                  Back to Login
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}