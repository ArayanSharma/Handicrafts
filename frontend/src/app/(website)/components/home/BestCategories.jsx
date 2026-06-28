"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../Style/BestCategories.css";

const categories = [
  {
    title: "Planters",
    image: "/c1.webp",
  },
  {
    title: "Side Tables",
    image: "/c2.webp",
  },
  {
    title: "Mirrors",
    image: "/c3.webp",
  },
  {
    title: "Console Tables",
    image: "/c4.webp",
  },
];

export default function BestCategories() {
  const [openMenu, setOpenMenu] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (index) => {
    if (openMenu === index) {
      setOpenMenu(null);
    } else {
      setOpenMenu(index);
    }
  };

  return (
    <section className="best-category-section">
      <div className="best-category-container">
        <h2 className="best-category-title">
          Best Categories
        </h2>

        <div className="best-category-grid">
          {categories.map(
            (item, index) => (
              <div
                key={index}
                className="best-category-card"
                style={{
                  position:
                    "relative",
                  overflow:
                    "visible",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="best-category-image"
                />

                <div className="best-category-overlay">
                  <h3>{item.title}</h3>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggle(
                        index
                      )
                    }
                    style={{
                      cursor:
                        "pointer",
                      transition:
                        "0.3s",
                    }}
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                    View Products
                  </button>

                  {openMenu ===
                    index && (
                    <div
                      style={{
                        position:
                          "absolute",
                        bottom:
                          "90px",
                        left: "50%",
                        transform:
                          "translateX(-50%)",
                        width:
                          "350px",
                        maxHeight:
                          "380px",
                        overflowY:
                          "auto",
                        background:
                          "#fff",
                        borderRadius:
                          "14px",
                        boxShadow:
                          "0 15px 40px rgba(0,0,0,.18)",
                        zIndex:
                          9999,
                        padding:
                          "10px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          marginBottom:
                            "10px",
                          fontWeight:
                            "600",
                          fontSize:
                            "18px",
                        }}
                      >
                        <span>
                          Shop the
                          Look
                        </span>

                        <button
                          onClick={() =>
                            setOpenMenu(
                              null
                            )
                          }
                          style={{
                            border:
                              "none",
                            background:
                              "none",
                            fontSize:
                              "20px",
                            cursor:
                              "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>

                      {products
                        .filter(
                          (
                            product
                          ) => {
                            const categoryMap =
                              {
                                Planters:
                                  "Planters",

                                Mirrors:
                                  "Mirrors",

                                "Side Tables":
                                  "Furniture",

                                "Console Tables":
                                  "Furniture",
                              };

                            return (
                              product.category ===
                              categoryMap[
                                item
                                  .title
                              ]
                            );
                          }
                        )
                        .map(
                          (
                            product
                          ) => (
                            <Link
                              key={
                                product._id
                              }
                              href={`/productdet/${product._id}`}
                              style={{
                                textDecoration:
                                  "none",
                                color:
                                  "#111",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "12px",
                                  padding:
                                    "12px 0",
                                  borderBottom:
                                    "1px solid #eee",
                                }}
                              >
                                <div
                                  style={{
                                    width:
                                      "60px",
                                    height:
                                      "60px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <img
                                    src={`http://localhost:5000${product.mainImage}`}
                                    alt={
                                      product.name
                                    }
                                    style={{
                                      width:
                                        "100%",
                                      height:
                                        "100%",
                                      objectFit:
                                        "cover",
                                      borderRadius:
                                        "8px",
                                    }}
                                  />
                                </div>

                                <div>
                                  <h4
                                    style={{
                                      fontSize:
                                        "14px",
                                      margin:
                                        0,
                                    }}
                                  >
                                    {
                                      product.name
                                    }
                                  </h4>

                                  <div
                                    style={{
                                      marginTop:
                                        "5px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          "#0f5132",
                                        fontWeight:
                                          "700",
                                      }}
                                    >
                                      Rs.{" "}
                                      {Number(
                                        product.price
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>

                                    {product.discount >
                                      0 && (
                                      <span
                                        style={{
                                          marginLeft:
                                            "8px",
                                          color:
                                            "#999",
                                          textDecoration:
                                            "line-through",
                                        }}
                                      >
                                        Rs.{" "}
                                        {Math.round(
                                          product.price /
                                            (1 -
                                              product.discount /
                                                100)
                                        ).toLocaleString(
                                          "en-IN"
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )
                        )}

                      {products.filter(
                        (
                          product
                        ) => {
                          const categoryMap =
                            {
                              Planters:
                                "Planters",

                              Mirrors:
                                "Mirrors",

                              "Side Tables":
                                "Furniture",

                              "Console Tables":
                                "Furniture",
                            };

                          return (
                            product.category ===
                            categoryMap[
                              item.title
                            ]
                          );
                        }
                      ).length ===
                        0 && (
                        <div
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "20px",
                          }}
                        >
                          No products
                          found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}