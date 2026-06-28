"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import "../Style/Dashboard.css";

const salesData = [
  40, 36, 48, 44, 58, 54, 66,
  62, 76, 70, 82, 78, 90, 84,
];

const topProducts = [
  {
    name: "Handmade Product",
    units: 0,
    color: "#C1622D",
  },
];

const statusLabel = {
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  pending: "Pending",
  delivered: "Delivered",
};

function StatCard({
  value,
  label,
  trend,
  trendType,
}) {
  return (
    <div className="statCard">
      <div className="statValue">
        {value}
      </div>

      <div className="statLabel">
        {label}
      </div>

      <div
        className={`statTrend ${trendType}`}
      >
        {trendType ===
          "positive" && (
          <TrendingUp size={12} />
        )}

        {trendType ===
          "warning" && (
          <AlertTriangle size={12} />
        )}

        <span>{trend}</span>
      </div>
    </div>
  );
}

function OrderStatusBadge({
  status,
}) {
  return (
    <span
      className={`badge ${status}`}
    >
      {statusLabel[status] ||
        status}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] =
    useState([]);

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        const data =
          await res.json();

        if (data.success) {
          setStats([
            {
              id: "revenue",
              label:
                "Total Revenue",
              value: `₹${(
                data.stats
                  .revenue || 0
              ).toLocaleString(
                "en-IN"
              )}`,
              trend:
                "Revenue Generated",
              trendType:
                "positive",
            },
            {
              id: "orders",
              label:
                "Total Orders",
              value:
                data.stats
                  .totalOrders ||
                0,
              trend:
                "Orders Received",
              trendType:
                "positive",
            },
            {
              id: "products",
              label:
                "Products",
              value:
                data.stats
                  .products || 0,
              trend:
                "Products Listed",
              trendType:
                "neutral",
            },
            {
              id: "lowstock",
              label:
                "Low Stock",
              value:
                data.stats
                  .lowStock || 0,
              trend:
                "Needs Restock",
              trendType:
                "warning",
            },
          ]);

          setRecentOrders(
            data.recentOrders ||
              []
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="overview">
        <h2>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="overview">
      {/* Stats */}
      <section className="statsGrid">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            {...stat}
          />
        ))}
      </section>

      {/* Charts */}
      <section className="midGrid">
        <div className="card">
          <h2 className="cardTitle">
            Sales Overview
          </h2>

          <div className="chartBars">
            {salesData.map(
              (
                height,
                index
              ) => (
                <div
                  key={index}
                  className="bar"
                  style={{
                    height: `${height}%`,
                  }}
                />
              )
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="cardTitle">
            Store Summary
          </h2>

          <ul className="productList">
            {topProducts.map(
              (product) => (
                <li
                  key={
                    product.name
                  }
                  className="productRow"
                >
                  <span className="productName">
                    <span
                      className="swatch"
                      style={{
                        backgroundColor:
                          product.color,
                      }}
                    />
                    {
                      product.name
                    }
                  </span>

                  <span className="productUnits">
                    {
                      stats[2]
                        ?.value
                    }{" "}
                    Products
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* Orders */}
      <section className="card">
        <h2 className="cardTitle">
          Recent Orders
        </h2>

        <div className="tableScroll">
          <div className="ordersHeader">
            <span>Order</span>
            <span>
              Customer
            </span>
            <span>
              Product
            </span>
            <span>
              Amount
            </span>
            <span>
              Status
            </span>
            <span>Date</span>
          </div>

          {recentOrders.length >
          0 ? (
            recentOrders.map(
              (order) => (
                <div
                  key={
                    order._id
                  }
                  className="ordersRow"
                >
                  <span className="orderId">
                    #
                    {order._id.slice(
                      -6
                    )}
                  </span>

                  <span>
                    {order
                      ?.shippingAddress
                      ?.fullName ||
                      "Customer"}
                  </span>

                  <span>
                    {order
                      ?.orderItems?.[0]
                      ?.name ||
                      "Product"}
                  </span>

                  <span className="amount">
                    ₹
                    {order.totalPrice}
                  </span>

                  <span>
                    <OrderStatusBadge
                      status={
                        order.orderStatus ||
                        "pending"
                      }
                    />
                  </span>

                  <span className="orderDate">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </span>
                </div>
              )
            )
          ) : (
            <div
              style={{
                padding:
                  "30px",
                textAlign:
                  "center",
              }}
            >
              No Orders Found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}