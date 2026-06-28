"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../../Style/BlogDetail.css";

const API_URL = "http://localhost:5000";

export default function BlogDetail() {
  const params = useParams();

  const id = params?.id;

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/blogs/${id}`
      );

      const data = await res.json();

      if (data.success) {
        setBlog(data.blog);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs =
    async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/blogs`
        );

        const data = await res.json();

        if (data.success) {
          setRelatedBlogs(
            data.blogs
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  const imageUrl = (image) => {
    if (!image)
      return "/placeholder.png";

    if (
      image.startsWith("http")
    )
      return image;

    return `${API_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <h2>Loading Blog...</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <h2>Blog Not Found</h2>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-breadcrumb">
        Home • Blog •{" "}
        {blog.title}
      </div>

      <div className="blog-hero">
    <img
  src={imageUrl(blog.image)}
  alt={blog.title}
  className="w-full h-full object-cover"
/>
      </div>

      <div className="blog-category">
        Blog
      </div>

      <h1 className="blog-title">
        {blog.title}
      </h1>

      <div className="blog-meta">
        Post by{" "}
        <span>
          Creator Handicrafts
        </span>
        {" • "}
        {new Date(
          blog.createdAt
        ).toLocaleDateString(
          "en-IN"
        )}
      </div>

      <div className="blog-content">
        <p
          style={{
            whiteSpace:
              "pre-line",
          }}
        >
          {blog.description}
        </p>
      </div>

      <div className="share-section">
        <span>Share:</span>

        <button>f</button>

        <button>x</button>

        <button>in</button>
      </div>

      <h2 className="related-heading">
        Related Posts
      </h2>

      <div className="related-posts">
        {relatedBlogs
          .filter(
            (item) =>
              item._id !==
              blog._id
          )
          .slice(0, 3)
          .map((item) => (
            <Link
              key={item._id}
              href={`/blog-detail/${item._id}`}
              className="related-card"
            >
              <div className="related-img">
                <img
  src={imageUrl(item.image)}
  alt={item.title}
  className="w-full h-full object-cover"
/>
              </div>

              <h4>
                {item.title}
              </h4>

              <p>
                {item.description?.substring(
                  0,
                  120
                )}
                ...
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}