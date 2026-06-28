"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    SlidersHorizontal,
    LayoutGrid,
    Grid3x3,
    List,
    ChevronDown,
} from "lucide-react";

import ProductCard from "../components/islamicwalll/ProductCard";
import Shipping from "../components/reviews/Shipping";

const API_URL = "http://localhost:5000/api";
const IMAGE_URL = "http://localhost:5000";

const SORT_OPTIONS = [
    "Featured",
    "Best selling",
    "Price, low to high",
    "Price, high to low",
    "Newest",
];

const VIEW_BUTTONS = [
    {
        mode: "grid-2",
        icon: <LayoutGrid size={16} />,
        label: "2 Columns",
    },
    {
        mode: "grid-3",
        icon: <Grid3x3 size={16} />,
        label: "3 Columns",
    },
    {
        mode: "grid-4",
        icon: <Grid3x3 size={14} />,
        label: "4 Columns",
    },
    {
        mode: "list",
        icon: <List size={16} />,
        label: "List",
    },
];

const GRID_CLASSES = {
    "grid-2": "grid-cols-1 sm:grid-cols-2",
    "grid-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "grid-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    list: "grid-cols-1",
};

export default function CategoryPage() {
    const { categorySlug } = useParams();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sortOpen, setSortOpen] = useState(false);
    const [sort, setSort] = useState("Featured");

    const [view, setView] = useState("grid-4");

    useEffect(() => {
        if (categorySlug) {
            fetchCategoryProducts();
        }
    }, [categorySlug]);

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true);

            // Fetch Category List
            const categoryRes = await fetch(
                `${API_URL}/categories`
            );

            const categoryData =
                await categoryRes.json();

            let currentCategory = null;

            if (categoryData.success) {
                currentCategory = categoryData.categories.find((cat) => {
                    return (
                        cat.slug
                            .toLowerCase()
                            .replace(/\s+/g, "-") ===
                        categorySlug.toLowerCase()
                    );
                });

                console.log("URL Slug:", categorySlug);
                console.log("Matched Category:", currentCategory);

                setCategory(currentCategory || null);
            }

            // Fetch Products
            if (!currentCategory) {
                setProducts([]);
                return;
            }

            const productRes = await fetch(
                `${API_URL}/products?category=${encodeURIComponent(
                    currentCategory.name
                )}`
            );
            const productData =
                await productRes.json();

            if (productData.success) {
                setProducts(productData.products || []);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const sortedProducts = [...products].sort(
        (a, b) => {
            if (sort === "Price, low to high") {
                return a.price - b.price;
            }

            if (sort === "Price, high to low") {
                return b.price - a.price;
            }

            return 0;
        }
    );
    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center justify-center h-72">
                    <div className="text-lg font-medium text-gray-600">
                        Loading Products...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">

            {/* Breadcrumb */}
            <div className="text-center">

                <p className="text-sm text-gray-500">
                    Home • {category?.name || "Category"}
                </p>

                <h1 className="mt-2 text-4xl font-bold text-neutral-900">
                    {category?.name || "Category"}
                </h1>

                {category?.description && (
                    <p className="mt-4 max-w-3xl mx-auto text-gray-500">
                        {category.description}
                    </p>
                )}

            </div>

            {/* Top Toolbar */}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">

                {/* Left */}

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-sm bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
                    >
                        <SlidersHorizontal size={15} />
                        Filter
                    </button>

                    <span className="text-sm text-neutral-500">
                        There are{" "}
                        <strong className="text-neutral-800">
                            {sortedProducts.length}
                        </strong>{" "}
                        products
                    </span>

                </div>

                {/* Right */}

                <div className="flex items-center gap-5">

                    {/* View Switch */}

                    <div className="hidden sm:flex items-center gap-2">

                        {VIEW_BUTTONS.map((btn) => (

                            <button
                                key={btn.mode}
                                onClick={() => setView(btn.mode)}
                                className={`rounded-md p-2 transition ${view === btn.mode
                                    ? "bg-neutral-900 text-white"
                                    : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                                    }`}
                                aria-label={btn.label}
                            >
                                {btn.icon}
                            </button>

                        ))}

                    </div>

                    {/* Sort */}

                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setSortOpen(!sortOpen)
                            }
                            className="flex items-center gap-2 text-sm font-medium text-neutral-700"
                        >
                            <span className="text-neutral-500">
                                Sort by:
                            </span>

                            {sort}

                            <ChevronDown size={16} />
                        </button>

                        {sortOpen && (

                            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-xl z-30">

                                {SORT_OPTIONS.map((option) => (

                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSort(option);
                                            setSortOpen(false);
                                        }}
                                        className={`block w-full px-4 py-3 text-left text-sm transition ${option === sort
                                            ? "bg-neutral-100 font-semibold"
                                            : "hover:bg-neutral-50"
                                            }`}
                                    >
                                        {option}
                                    </button>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>
            {/* Product Grid */}

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
                                hoverImage={
                                    product.hoverImage
                                        ? `${IMAGE_URL}${product.hoverImage}`
                                        : `${IMAGE_URL}${product.mainImage}`
                                }
                                title={product.name}
                                price={product.price}
                                oldPrice={
                                    product.discount
                                        ? product.price +
                                        (product.price * product.discount) / 100
                                        : product.price
                                }
                                discount={product.discount}
                            />
                        </Link>

                    ))

                ) : (

                    <div className="col-span-full py-24 text-center">

                        <div className="mx-auto max-w-md">

                            <h2 className="text-2xl font-semibold text-neutral-900">
                                No Products Found
                            </h2>

                            <p className="mt-3 text-neutral-500">
                                There are currently no products available
                                in this category.
                            </p>

                            <Link
                                href="/"
                                className="inline-flex mt-8 rounded-md bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-800 transition"
                            >
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                )}

            </div>

            {/* Shipping Section */}

            <div className="mt-16">
                <Shipping />
            </div>

        </section>
    );
}