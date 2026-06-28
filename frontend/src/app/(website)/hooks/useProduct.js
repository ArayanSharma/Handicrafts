import { useState, useEffect } from "react";

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    async function fetchAll() {
      try {
        setLoading(true);
        const [prodRes, relRes] = await Promise.all([
          fetch(`${BASE}/api/products/${id}`),
          fetch(`${BASE}/api/products?limit=4`),
        ]);
        const prodData = await prodRes.json();
        const relData = await relRes.json();
        setProduct(prodData.product || prodData);
        // apna product related se hata do
        setRelated(
          (relData.products || relData).filter((p) => p._id !== id)
        );
      } catch (err) {
        setError("Product load nahi hua");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  return { product, related, loading, error };
}

export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    if (!productId) return;
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${BASE}/api/reviews?product=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.reviews || data;
        setReviews(list);
        if (list.length) {
          const total = list.reduce((s, r) => s + r.rating, 0);
          setAvg((total / list.length).toFixed(1));
        }
      });
  }, [productId]);

  return { reviews, avg };
}