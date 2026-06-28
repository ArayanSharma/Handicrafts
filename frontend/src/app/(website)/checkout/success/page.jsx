"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">

            <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl p-10 text-center">

                <CheckCircle2
                    size={90}
                    className="text-green-600 mx-auto"
                />

                <h1 className="text-4xl font-bold mt-6">
                    Order Placed Successfully
                </h1>

                <p className="text-gray-500 mt-4">
                    Thank you for shopping with us.
                </p>

                <div className="mt-8 bg-gray-100 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                        Order ID
                    </p>

                    <p className="font-bold break-all mt-2">
                        {orderId}
                    </p>

                </div>

                <div className="mt-8 space-y-3">

                    <Link href="/">
                        <button className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition">
                            Continue Shopping
                        </button>
                    </Link>

                    <Link href="/track-order">
                        <button className="w-full border border-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition">
                            Track Order
                        </button>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}