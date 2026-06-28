"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../Style/Blogs.css";

const API_URL =
  "http://localhost:5000";

export default function Blogs() {
  const [blogs, setBlogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/blogs`
      );

      const data =
        await res.json();

      if (data.success) {
        setBlogs(
          data.blogs || []
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (
    image
  ) => {
    if (!image)
      return "/blog1.webp";

    if (
      image.startsWith(
        "http"
      )
    ) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  if (loading) {
    return (
      <section className="blogs-section">
        <div className="blogs-container">
          <div className="blogs-header">
            <h2>
              Our Design Diaries
            </h2>
            <p>
              Loading blogs...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blogs-section">
      <div className="blogs-container">
        <div className="blogs-header">
          <h2>
            Our Design Diaries
          </h2>

          <p>
            Stay inspired!
            Follow our blog
            for expert home
            decor advice
          </p>
        </div>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <Link
              href={`/blog-detail/${blog._id}`}
              key={blog._id}
              className="blog-link"
            >
              <article className="blog-card">
                <div className="blog-image">
                  <Image
                    src={getImageUrl(
                      blog.image
                    )}
                    alt={
                      blog.title
                    }
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    unoptimized
                  />
                </div>

                <div className="blog-content">
                  <span className="blog-category">
                    News
                  </span>

                  <h3>
                    {
                      blog.title
                    }
                  </h3>

                  <p>
                    {blog.description?.length >
                    120
                      ? `${blog.description.substring(
                          0,
                          120
                        )}...`
                      : blog.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogs.length ===
          0 && (
          <div
            style={{
              textAlign:
                "center",
              padding:
                "40px",
            }}
          >
            No Blogs Found
          </div>
        )}
      </div>
    </section>
  );
}