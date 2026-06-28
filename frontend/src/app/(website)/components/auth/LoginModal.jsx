"use client";

import "../../Style/LoginModal.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";

export default function LoginModal({
    open,
    onClose,
}) {
    const router = useRouter();

    const BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000";
    const [showPassword, setShowPassword] =
        useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKey
            );
    }, [onClose]);

    if (!open) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const endpoint = isRegister
                ? `${BASE}/api/auth/register`
                : `${BASE}/api/auth/login`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // Login Successful
            if (!isRegister) {
                localStorage.setItem("token", data.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                onClose();

                router.push("/account");
            } else {
                alert("Account created successfully!");

                setIsRegister(false);

                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                });
            }

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="login-overlay"
            onClick={onClose}
        >
            <div
                className="login-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <h2>
                    {isRegister ? "Create Account" : "Sign In"}
                </h2>
                <p className="subtitle">
                    {isRegister
                        ? "Please register below to create an account."
                        : "Please enter your details below to sign in."}
                </p>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <div className="input-box">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email*"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-box password-box">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            placeholder="Password*"
                            value={
                                formData.password
                            }
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="button"
                            className="eye-btn"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {!isRegister && (
                        <a
                            href="/forgot-password"
                            className="forgot"
                        >
                            Forgot your password?
                        </a>
                    )}
                    {isRegister && (
                        <p className="privacy-text">
                            Your personal data will be used to
                            support your experience throughout
                            this website, to manage access to
                            your account and for other purposes
                            described in our privacy policy.
                        </p>
                    )}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Sign Up"
                                : "Login"}
                    </button>

                    <button
                        type="button"
                        className="register-btn"
                        onClick={() =>
                            setIsRegister(!isRegister)
                        }
                    >
                        {isRegister
                            ? "Login"
                            : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}