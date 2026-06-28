"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Trash2,
} from "lucide-react";
import "../Style/Users.css";

const filters = ["All", "New", "Repeat"];

const sortOptions = [
  {
    value: "orders",
    label: "Most Orders",
  },
  {
    value: "spent",
    label: "Highest Spend",
  },
  {
    value: "newest",
    label: "Newest Users",
  },
];

function initials(name) {
  return name
    ?.split(" ")
    ?.map((part) => part[0])
    ?.join("")
    ?.toUpperCase();
}

export default function Users() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState("All");
  const [searchTerm, setSearchTerm] =
    useState("");
  const [sortBy, setSortBy] =
    useState("orders");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCustomers(data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setCustomers((prev) =>
          prev.filter(
            (user) => user._id !== id
          )
        );

        alert("User deleted");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  const filtered = customers.filter(
    (customer) => {
      const tag =
        customer.totalOrders > 1
          ? "repeat"
          : "new";

      const matchesFilter =
        activeFilter === "All" ||
        tag === activeFilter.toLowerCase();

      const term =
        searchTerm.toLowerCase();

      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(term) ||
        customer.email
          .toLowerCase()
          .includes(term);

      return (
        matchesFilter && matchesSearch
      );
    }
  );

  const sorted = [...filtered].sort(
    (a, b) => {
      if (sortBy === "orders") {
        return (
          b.totalOrders - a.totalOrders
        );
      }

      if (sortBy === "spent") {
        return (
          b.totalSpent - a.totalSpent
        );
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }
  );

  if (loading) {
    return (
      <div className="usr-users">
        <h2>Loading Users...</h2>
      </div>
    );
  }

  return (
    <div className="usr-users">
      <div className="usr-toolbar">
        <div className="usr-filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`usr-filter-tab ${
                activeFilter === filter
                  ? "usr-filter-tab-active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(filter)
              }
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="usr-toolbar-right">
          <div className="usr-search-wrap">
            <Search
              size={14}
              className="usr-search-icon"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search by name or email"
              className="usr-search-input"
            />
          </div>

          <div className="usr-select-wrap">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="usr-select"
            >
              {sortOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={14}
              className="usr-select-icon"
            />
          </div>
        </div>
      </div>

      <div className="usr-card">
        <div className="usr-table-scroll">
          <div className="usr-users-header">
            <span>Customer</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Joined</span>
            <span>Tag</span>
            <span>Action</span>
          </div>

          {sorted.map((customer) => {
            const tag =
              customer.totalOrders > 1
                ? "repeat"
                : "new";

            return (
              <div
                key={customer._id}
                className="usr-user-row"
              >
                <span className="usr-customer-cell">
                  <span
                    className="usr-avatar"
                    style={{
                      backgroundColor:
                        "#C1622D",
                    }}
                  >
                    {initials(
                      `${customer.firstName} ${customer.lastName}`
                    )}
                  </span>

                  <span className="usr-customer-info">
                    <span className="usr-customer-name">
                      {customer.firstName}{" "}
                      {
                        customer.lastName
                      }
                    </span>

                    <span className="usr-customer-email">
                      {customer.email}
                    </span>
                  </span>
                </span>

                <span className="usr-order-count">
                  {
                    customer.totalOrders
                  }
                </span>

                <span className="usr-amount">
                  ₹
                  {(
                    customer.totalSpent ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="usr-last-order">
                  {new Date(
                    customer.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </span>

                <span>
                  <span
                    className={`usr-tag-badge ${tag}`}
                  >
                    {tag === "repeat"
                      ? "Repeat"
                      : "New"}
                  </span>
                </span>

                <span>
                  <button
                    onClick={() =>
                      deleteUser(
                        customer._id
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "#ef4444",
                      color: "#fff",
                      padding:
                        "8px 12px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "5px",
                    }}
                  >
                    <Trash2
                      size={14}
                    />
                    Delete
                  </button>
                </span>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="usr-empty-state">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}