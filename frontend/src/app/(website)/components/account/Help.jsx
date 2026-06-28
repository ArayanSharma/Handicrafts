"use client";

import {
    Phone,
    Mail,
    MessageCircle,
} from "lucide-react";

export default function Help() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">

            <h2 className="text-3xl font-bold mb-8">
                Help & Support
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="border rounded-xl p-6 text-center hover:shadow-md transition">

                    <Phone
                        className="mx-auto mb-4 text-green-700"
                        size={40}
                    />

                    <h3 className="text-xl font-semibold mb-2">
                        Call Us
                    </h3>

                    <p className="text-gray-500">
                        +91 7017248315
                    </p>

                </div>

                <div className="border rounded-xl p-6 text-center hover:shadow-md transition">

                    <Mail
                        className="mx-auto mb-4 text-green-700"
                        size={40}
                    />

                    <h3 className="text-xl font-semibold mb-2">
                        Email
                    </h3>

                    <p className="text-gray-500">
                        care@creatorhandicrafts.com
                    </p>

                </div>

                <div className="border rounded-xl p-6 text-center hover:shadow-md transition">

                    <MessageCircle
                        className="mx-auto mb-4 text-green-700"
                        size={40}
                    />

                    <h3 className="text-xl font-semibold mb-2">
                        Live Chat
                    </h3>

                    <p className="text-gray-500">
                        Coming Soon
                    </p>

                </div>

            </div>

        </div>
    );
}