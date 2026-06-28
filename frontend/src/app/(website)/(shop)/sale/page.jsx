// src/app/islamic-wall-art/page.jsx
"use client";

import { useState } from "react";
import ProductCard from "../../components/islamicwalll/ProductCard";
import Shipping from "../../components/reviews/Shipping";

import Link from "next/link";
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid3x3,
  List,
  ChevronDown,
} from "lucide-react";

const SORT_OPTIONS = [
  "Featured",
  "Best selling",
  "Price, low to high",
  "Price, high to low",
  "Newest",
];

export const products = [
  {
    id: 1,
    title: "Hadha Min Fadli Rabbi Islamic Wall Art",
    image: "/p1.png",
    sale: "-45%",
    price: 2999,
    oldPrice: 5500,
    colors: ["#c4b59f", "#000"],
  },
  {
    id: 2,
    title: "Hasbunallahu wa ni'mal wakeel Islamic Wall Art",
    image: "/p2.png",
    sale: "-45%",
    price: 2999,
    oldPrice: 5500,
    colors: ["#d4c4a8", "#666"],
  },
  {
    id: 3,
    title: "Kul Huwal Laahu Ahad Islamic Wall Art",
    image: "/p3.png",
    sale: "-45%",
    price: 2999,
    oldPrice: 5500,
    colors: ["#000", "#facc15"],
  },
  {
    id: 4,
    title: "Mashaallah Tabarakallah Metal Islamic Wall Art",
    image: "/p4.png",
    sale: "-45%",
    price: 2999,
    oldPrice: 5500,
    colors: ["#c4b59f", "#888"],
  },
  {
    id: 5,
    title: "Allah Circular Metal Wall Art",
    image: "/p1.png",
    sale: "-27%",
    price: 3999,
    oldPrice: 5500,
    colors: ["#555"],
  },
  {
    id: 6,
    title: "Ayatul Kursi Metal Wall Art",
    image: "/p1.png",
    sale: "-45%",
    price: 2999,
    oldPrice: 5500,
    colors: ["#000"],
  },
];

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

export default function IslamicWallArtPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [view, setView] = useState("grid-4");

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "Price, low to high") return a.price - b.price;
    if (sort === "Price, high to low") return b.price - a.price;
    return 0;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Home • Sale
</p>
        <h1 className="text-4xl font-bold mt-2">Sale</h1>
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
                className={`rounded p-1.5 ${
                  view === mode
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
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                        option === sort
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
  {sortedProducts.map((product) => (
    <Link
      key={product.id}
      href={`/productdet/${product.id}`}
      className="block"
    >
      <ProductCard
        image={product.image}
        hoverImage={product.image}
        title={product.title}
        price={product.price}
        oldPrice={product.oldPrice}
        discount={parseInt(product.sale)}
      />
    </Link>
  ))}
</div>

      <Shipping />
    </section>
  );
}