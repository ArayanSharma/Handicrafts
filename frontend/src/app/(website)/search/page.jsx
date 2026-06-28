"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../components/islamicwalll/ProductCard";
import Shipping from "../components/reviews/Shipping";

const API_URL = "http://localhost:5000/api";
const IMAGE_URL = "http://localhost:5000";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        if (data.success) {
          const allProducts = data.products || [];
          const normalizedQuery = query.toLowerCase();

          const filteredProducts = normalizedQuery
            ? allProducts.filter((product) => {
                const searchText = [
                  product.name,
                  product.category,
                  product.description,
                  product.shortDescription,
                  product.slug,
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();

                return searchText.includes(normalizedQuery);
              })
            : allProducts;

          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="py-10 text-center">Loading search results...</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="text-center">
        <p className="text-sm text-gray-500">Home • Search</p>
        <h1 className="mt-2 text-4xl font-bold">
          {query ? `Search results for “${query}”` : "Search products"}
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          {products.length} result{products.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id}
              href={`/productdet/${product._id}`}
              className="block"
            >
              <ProductCard
                image={`${IMAGE_URL}${product.mainImage}`}
                hoverImage={`${IMAGE_URL}${product.hoverImage}`}
                title={product.name}
                price={product.price}
                oldPrice={
                  product.price +
                  (product.discount
                    ? product.price * (product.discount / 100)
                    : 0)
                }
                discount={product.discount}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-600">
            No products matched your search. Try a different keyword.
          </div>
        )}
      </div>

          <Shipping />
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-center">Loading search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}