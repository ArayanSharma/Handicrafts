"use client";

import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import Image from "next/image";
export default function CheckoutPage() {
    const [items, setItems] = useState([]);
    const BASE =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000";
    useEffect(() => {
        const cart = JSON.parse(
            localStorage.getItem("cartItems") || "[]"
        );
        setItems(cart);
    }, []);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-5">

                <h1 className="text-3xl font-bold mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}

                    <div className="lg:col-span-2">

                        <CheckoutForm
                            items={items}
                            total={total}
                        />

                    </div>

                    {/* RIGHT */}

                    <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-24">

                        <h2 className="text-xl font-bold mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-4">

                            {items.map((item, index) => (

                                <div
                                    key={index}
                                    className="flex items-center gap-4 pb-4 border-b"
                                >

                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border">
                                        <Image
                                            src={
                                                item.mainImage?.startsWith("http")
                                                    ? item.mainImage
                                                    : `${BASE}${item.mainImage}`
                                            }
                                            alt={item.name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />

                                    </div>

                                    <div className="flex-1">

                                        <h3 className="font-semibold text-sm line-clamp-2">
                                            {item.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Qty : {item.quantity}
                                        </p>

                                        <p className="font-bold mt-2">
                                            ₹{item.price.toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            ))}
                        </div>

                        <hr className="my-5" />

                        <div className="flex justify-between text-lg font-bold">

                            <span>Total</span>

                            <span>
                                ₹{total.toLocaleString()}
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}