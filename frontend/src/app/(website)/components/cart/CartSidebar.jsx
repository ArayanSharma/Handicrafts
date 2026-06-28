"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

import {
    X,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";

const BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

const imgUrl = (path) => {
    if (!path) return "/placeholder.jpg";

    if (path.startsWith("http"))
        return path;

    return path.startsWith("/")
        ? `${BASE}${path}`
        : `${BASE}/${path}`;
};

export default function CartSidebar({
    open,
    onClose,
}) {

    const [step, setStep] = useState("cart");
    const [loading, setLoading] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [note, setNote] = useState("");
    const [items, setItems] = useState([]);

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {

        loadCart();

        window.addEventListener(
            "cartUpdated",
            loadCart
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                loadCart
            );
        };

    }, [open]);

    const loadCart = () => {

        try {

            const cart = JSON.parse(
                localStorage.getItem("cartItems") || "[]"
            );

            setItems(cart);

        } catch {

            setItems([]);

        }

    };

    const [offerOpen, setOfferOpen] = useState(false);

    const updateQuantity = (index, value) => {

        const updated = [...items];

        updated[index].quantity = Math.max(
            1,
            updated[index].quantity + value
        );

        localStorage.setItem(
            "cartItems",
            JSON.stringify(updated)
        );

        setItems(updated);

        window.dispatchEvent(
            new Event("cartUpdated")
        );

    };

    const removeItem = (index) => {

        const updated = items.filter(
            (_, i) => i !== index
        );

        localStorage.setItem(
            "cartItems",
            JSON.stringify(updated)
        );

        setItems(updated);

        window.dispatchEvent(
            new Event("cartUpdated")
        );

    };

    const total = items.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );
    const placeOrder = async () => {
        if (
            !form.fullName ||
            !form.phone ||
            !form.address ||
            !form.city ||
            !form.state ||
            !form.pincode
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                items: items.map((item) => ({
                    product: item.productId,
                    name: item.name,
                    image: item.mainImage,
                    price: item.price,
                    quantity: item.quantity,
                })),

                shippingAddress: {
                    fullName: form.fullName,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                    country: "India",
                },

                paymentMethod: "COD",

                itemsPrice: total,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice: total,

                notes: note,
            };

            const res = await fetch(
                `${BASE}/api/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Order Failed"
                );
            }

            setOrderPlaced(true);
            setOrderId(data.order._id);

            localStorage.removeItem("cartItems");

            setItems([]);

            window.dispatchEvent(
                new Event("cartUpdated")
            );
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };
    const totalDiscount = items.reduce(
        (sum, item) =>
            sum + (item.price * 0.25) * item.quantity,
        0
    );

    return (
        <>
            {/* Overlay */}

            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all  duration-300 ${open
                    ? "opacity-40"
                    : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Drawer */}

            <div
                className={`fixed top-0 right-0 h-screen w-full max-w-[440px] bg-white shadow-[0_0_40px_rgba(0,0,0,.15)] z-50 transition-transform duration-300 flex flex-col ${open
                    ? "translate-x-0"
                    : "translate-x-full"
                    }`}
            >
                {/* ================= HEADER ================= */}

                <div className="h-14 px-5 flex items-center justify-between border-b bg-white ">

                    <div className="flex items-center gap-2">

                        <h2 className="text-lg font-bold">
                            YOUR CART
                        </h2>

                        <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs font-bold">
                            {items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                            )}
                        </span>

                    </div>

                    <button
                        onClick={onClose}
                        className="hover:rotate-90 transition"
                    >
                        <X size={24} />
                    </button>

                </div>

                {/* LOGIN BAR */}
                <div className="mx-4 mt-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white p-3 shadow-sm">

                    <button
                        onClick={() =>
                            window.dispatchEvent(
                                new Event("openLoginModal")
                            )
                        }
                        className="font-bold text-sm"
                    >
                        Login to Unlock Extra Discount
                    </button>

                </div>

                {/* BODY */}

                <div className="flex-1 overflow-y-auto bg-white rounded-l-[5%]">

                    <div className="p-4 space-y-3">

                        {
                            items.length === 0 ? (

                                <div className="h-[450px] flex flex-col justify-center items-center">

                                    <ShoppingCart
                                        size={70}
                                        className="text-gray-300"
                                    />

                                    <h2 className="mt-5 text-xl font-bold">
                                        Your Cart is Empty
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        Start Shopping
                                    </p>

                                </div>

                            ) : (

                                items.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition"
                                    >

                                        <div className="flex gap-3">

                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">

                                                <Image
                                                    fill
                                                    src={imgUrl(item.mainImage)}
                                                    alt={item.name}
                                                    className="object-cover"
                                                />

                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">

                                                <div>

                                                    <div className="flex items-start justify-between gap-2">

                                                        <div className="flex-1">

                                                            <h3 className="font-semibold text-sm leading-4 text-gray-900 line-clamp-2">
                                                                {item.name}
                                                            </h3>

                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {item.variant || "Default"}
                                                            </p>

                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(index)}
                                                            className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                                                            title="Remove item"
                                                        >

                                                            <Trash2 size={16} />

                                                        </button>

                                                    </div>

                                                    <div className="mt-2 flex items-baseline gap-2">

                                                        <p className="text-sm font-bold text-gray-900">
                                                            ₹{item.price.toLocaleString()}
                                                        </p>

                                                        <p className="text-xs text-gray-400 line-through">
                                                            ₹{(item.price * 1.25).toLocaleString()}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="mt-3 flex items-center gap-2">

                                                    <button
                                                        onClick={() => updateQuantity(index, -1)}
                                                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center transition text-xs"
                                                    >

                                                        <Minus size={14} />

                                                    </button>

                                                    <span className="w-8 text-center font-semibold text-sm">

                                                        {item.quantity}

                                                    </span>

                                                    <button
                                                        onClick={() => updateQuantity(index, 1)}
                                                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center transition text-xs"
                                                    >

                                                        <Plus size={14} />

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            )

                        }

                        {items.length > 0 && step === "cart" && (
                            <>

                                {/* Coupon Card */}

                                <div className="bg-white rounded-lg border border-green-200 overflow-hidden mt-4">

                                    <div className="p-3 flex justify-between items-start gap-3">

                                        <div className="flex-1">

                                            <h4 className="text-green-700 font-bold text-sm">
                                                🏷 Save ₹100
                                            </h4>

                                            <p className="text-xs text-gray-500 mt-1">
                                                with code
                                            </p>

                                            <span className="inline-block font-bold text-xs bg-green-50 px-2 py-1 rounded mt-1">
                                                'SPECIAL100'
                                            </span>

                                        </div>

                                        <button className="px-4 py-1.5 rounded-lg bg-green-50 border border-green-500 font-semibold text-green-700 text-sm flex-shrink-0">
                                            Apply
                                        </button>

                                    </div>

                                    <div className="border-t px-3 py-2 flex items-center justify-between">

                                        <span className="text-xs font-medium text-gray-700">
                                            🎉 Saved with Discounts
                                        </span>

                                        <span className="font-bold text-green-700 text-sm">
                                            ₹100
                                        </span>

                                    </div>

                                </div>

                                {/* More Offers */}

                                <div className="bg-white rounded-lg border border-gray-200">

                                    <button
                                        onClick={() => setOfferOpen(!offerOpen)}
                                        className="w-full flex justify-between items-center p-3"
                                    >

                                        <span className="font-semibold text-sm">
                                            🎁 More Offers
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            {offerOpen ? "Hide" : "View all"} →
                                        </span>

                                    </button>

                                    {
                                        offerOpen && (

                                            <div className="px-4 pb-3 border-t text-xs text-gray-600 space-y-2">

                                                <div>
                                                    🎉 Buy 2 Products & Save 10%
                                                </div>

                                                <div>
                                                    🚚 Free Shipping Above ₹999
                                                </div>

                                                <div>
                                                    💳 5% Instant Discount on Prepaid
                                                </div>

                                            </div>

                                        )
                                    }

                                </div>

                                {/* Add a Note */}

                                <div className="bg-white rounded-lg border border-gray-200">

                                    <button
                                        onClick={() => setNoteOpen(!noteOpen)}
                                        className="w-full p-3 flex justify-between items-center"
                                    >

                                        <span className="font-medium text-sm">
                                            📝 Add a Note
                                        </span>

                                        <Plus size={18} className="text-gray-400" />

                                    </button>

                                    {
                                        noteOpen && (

                                            <div className="px-3 pb-3 border-t">

                                                <textarea

                                                    rows={3}

                                                    placeholder="Write delivery note..."

                                                    value={note}

                                                    onChange={(e) => setNote(e.target.value)}

                                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"

                                                />

                                            </div>

                                        )
                                    }

                                </div>

                                {/* Delivery Info */}

                                <div className="mt-4 rounded-lg bg-green-600 text-white py-2 px-3 text-center text-sm font-semibold">

                                    Standard Delivery: <span className="ml-1">5 - 7 Days</span>

                                </div>

                            </>
                        )}

                    </div>

                    {step === "address" && (
                        <div className="p-4 border-t space-y-3 bg-white">
                            <button
                                onClick={() => setStep("cart")}
                                className="mb-3 text-sm font-semibold"
                            >
                                ← Back
                            </button>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fullName: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <textarea
                                placeholder="Address"
                                value={form.address}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="City"
                                value={form.city}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        city: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="State"
                                value={form.state}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        state: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <input
                                type="text"
                                placeholder="Pincode"
                                value={form.pincode}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pincode: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg p-3"
                            />

                            <button
                                onClick={placeOrder}
                                className="w-full bg-green-600 text-white rounded-lg py-3 font-bold"
                            >
                                Place Order
                            </button>

                        </div>
                    )}

                    {/* FOOTER */}
                    {items.length > 0 && step === "cart" && (
                        <div className="border-t bg-white p-4 sticky bottom-0 shadow-[0_-5px_20px_rgba(0,0,0,.08)]">

                            <div className="flex justify-between items-start mb-3">

                                <span className="text-sm font-semibold text-gray-700">
                                    Estimated total
                                </span>

                                <div className="text-right">

                                    <p className="text-xs line-through text-gray-400">

                                        ₹ {(total * 1.25).toLocaleString()}

                                    </p>

                                    <h2 className="text-2xl font-bold text-green-700">

                                        ₹ {total.toLocaleString()}

                                    </h2>

                                    <p className="text-xs text-gray-600 mt-1">
                                        You saved ₹{Math.round(totalDiscount).toLocaleString()}!
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => {
                                    const token = localStorage.getItem("token");

                                    if (!token) {
                                        window.dispatchEvent(
                                            new Event("openLoginModal")
                                        );
                                        return;
                                    }

                                    onClose();
                                    window.location.href = "/checkout";
                                }}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold"
                            >
                                Continue
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-3">
                                Powered by Shopify
                            </p>

                        </div>
                    )}

                </div>

            </div>

        </>
    );
}