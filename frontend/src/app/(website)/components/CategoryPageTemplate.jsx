// components/CategoryPageTemplate.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProductCard from "./islamicwalll/ProductCard";
import Shipping from "./reviews/Shipping";
import Link from "next/link";
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid3x3,
  List,
  ChevronDown,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const IMAGE_URL = "http://localhost:5000";

const SORT_OPTIONS = [
  "Featured",
  "Best selling",
  "Price, low to high",
  "Price, high to low",
  "Newest",
];

const getCategoryName = (pathname) => {
  const slug = pathname.split("/").filter(Boolean)[0];
  return slug || "";
};

const viewButtons = [
  { mode: "grid-2", icon: <LayoutGrid size={16} />, label: "2 columns" },
  { mode: "grid-3", icon: <Grid3x3 size={16} />, label: "3 columns" },
  { mode: "grid-4", icon: <Grid3x3 size={14} />, label: "4 columns" },
  { mode: "list", icon: <List size={16} />, label: "List view" },
];

const GRID_CLASSES = {
  "grid-2": "grid-cols-1 sm:grid-cols-2",
  "grid-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "grid-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  list: "grid-cols-1",
};

export default function CategoryPage() {
  const pathname = usePathname();
  const categorySlug = getCategoryName(pathname);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [view, setView] = useState("grid-4");

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/products?category=${categorySlug}`
      );
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "Price, low to high")
      return a.price - b.price;
    if (sort === "Price, high to low")
      return b.price - a.price;
    return 0;
  });

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading Products...
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Home • {categorySlug}</p>
        <h1 className="text-4xl font-bold mt-2">
          {categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
      </div>

      {/* Top bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => console.log("open filters")}
            className="flex items-center gap-2 rounded-sm bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <span className="text-sm text-neutral-500">
            There are {sortedProducts.length} results in total
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            {viewButtons.map(({ mode, icon, label }) => (
              <button
                key={mode}
                type="button"
                aria-label={label}
                onClick={() => setView(mode)}
                className={`rounded p-1.5 ${view === mode
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
                  }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              className="flex items-center gap-2 text-sm text-neutral-700"
            >
              <span className="text-neutral-500">Sort by:</span>
              <span className="font-medium">{sort}</span>
              <ChevronDown size={14} />
            </button>

            {sortOpen && (
              <ul className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 ${option === sort
                        ? "font-medium text-neutral-900"
                        : "text-neutral-600"
                        }`}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className={`mt-10 grid gap-8 ${GRID_CLASSES[view]}`}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
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
                oldPrice={product.price + (product.discount ? product.price * (product.discount / 100) : 0)}
                discount={product.discount}
              />
            </Link>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>
            No products found in this category
          </div>
        )}
      </div>

      <Shipping />
    </section>
  );
}
