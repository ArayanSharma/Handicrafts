"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import "../../Style/FAQSection.css";

const API_URL = "http://localhost:5000/api/faqs";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setActive(
      active === index ? null : index
    );
  };

  if (loading) {
    return (
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="faq-title">
            FAQ
          </h2>

          <p>Loading FAQs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">
          FAQ
        </h2>

        <div className="faq-list">
          {faqs.length > 0 ? (
            faqs.map(
              (faq, index) => (
                <div
                  key={
                    faq._id || index
                  }
                  className="faq-item"
                >
                  <button
                    className="faq-question"
                    onClick={() =>
                      toggleFAQ(
                        index
                      )
                    }
                  >
                    <span>
                      {
                        faq.question
                      }
                    </span>

                    <div className="faq-icon">
                      {active ===
                      index ? (
                        <Minus
                          size={18}
                        />
                      ) : (
                        <Plus
                          size={18}
                        />
                      )}
                    </div>
                  </button>

                  <div
                    className={`faq-answer-wrapper ${
                      active ===
                      index
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "20px",
              }}
            >
              No FAQs Found
            </div>
          )}
        </div>
      </div>
    </section>
  );
}