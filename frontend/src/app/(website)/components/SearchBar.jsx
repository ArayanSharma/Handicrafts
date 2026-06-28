"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../Style/SearchBar.css";
import { Search, X } from "lucide-react";

export default function SearchBar({
    open,
    onClose,
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const trendingSearches = [
        "Marble Center Tables",
        "Wall Clocks",
        "Coffee Tables",
        "Floor Lamps",
        "Dining Tables",
        "Planters",
    ];

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKey
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKey
            );
    }, [onClose]);

    if (!open) return null;

    const handleSearch = (e) => {
        e.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) return;

        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        onClose();
    };

    const handleTrendingClick = (
        item
    ) => {
        const trimmedItem = item.trim();
        setQuery(trimmedItem);
        router.push(`/search?q=${encodeURIComponent(trimmedItem)}`);
        onClose();
    };

    return (
        <div className="search-overlay">
            <div className="search-container">

                <button
                    className="search-close"
                    onClick={onClose}
                >
                    <X size={32} />
                </button>

                <div className="search-content">

                    <h2>
                        Search Our Site
                    </h2>

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="search-form"
                    >
                        <div className="search-input-wrapper">

                            <input
                                type="text"
                                placeholder="I'm looking for..."
                                value={query}
                                onChange={(e) =>
                                    setQuery(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="submit"
                                className="search-btn"
                            >
                                <Search size={28} />
                            </button>

                        </div>
                    </form>

                    <div className="trending-section">

                        <h3>
                            Trending Search
                        </h3>

                        <div className="trending-tags">

                            {trendingSearches.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <button
                                        key={index}
                                        className="trend-tag"
                                        onClick={() =>
                                            handleTrendingClick(
                                                item
                                            )
                                        }
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>

                    </div>
                    {query && (
                        <div className="search-results">

                            <h4>
                                Search Preview
                            </h4>

                            <div className="result-box">

                                <p>
                                    Searching for:
                                </p>

                                <span>
                                    "{query}"
                                </span>

                            </div>

                            <button
                                className="view-all-btn"
                                onClick={() => {
                                    const trimmedQuery = query.trim();

                                    if (!trimmedQuery) return;

                                    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
                                    onClose();
                                }}
                            >
                                View all results
                            </button>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}