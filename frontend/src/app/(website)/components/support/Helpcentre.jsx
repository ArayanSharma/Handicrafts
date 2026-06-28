"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question:
        "What should I do if I receive a damaged or defective product?",
      answer:
        "Please contact our customer support team within 48 hours of receiving your order. Provide clear photos of the damaged or defective product, along with your order details. We'll review your request and arrange for a replacement for the same.",
    },
    {
      question:
        "How are home decor items packed to ensure they arrive safely?",
      answer:
        "All products are packed using premium protective materials to ensure safe delivery.",
    },
  ];

  return (
    <section className="bg-[#f7efe4] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-[35%_65%] gap-12 items-start">

          {/* Left Side */}
          <div>
            <p className="text-gray-500 text-sm mb-2">
              Have a question?
            </p>

            <h2 className="text-5xl font-bold text-black mb-6">
              Help Center
            </h2>

            <p className="text-gray-600 leading-7 mb-8">
              If you have an issue or question that requires
              immediate assistance, you can click the button
              below to chat live with a Customer Service
              representative.
            </p>

            <button className="bg-black text-white w-full max-w-sm py-4 rounded-full font-medium hover:bg-gray-900 transition">
              Contact Now
            </button>
          </div>

          {/* Right Side */}
          <div className="bg-white rounded-2xl overflow-hidden">

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b last:border-b-0"
              >
                <button
                  onClick={() =>
                    setOpenIndex(
                      openIndex === index
                        ? null
                        : index
                    )
                  }
                  className="w-full flex items-center justify-between px-8 py-6 text-left"
                >
                  <span className="font-semibold text-black">
                    {faq.question}
                  </span>

                  {openIndex === index ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-8 pb-6 text-gray-600 leading-7">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}