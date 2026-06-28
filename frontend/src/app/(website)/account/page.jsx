"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import AccountSidebar from "../components/account/AccountSidebar";
import Profile from "../components/account/Profile";
import Orders from "../components/account/Orders";
import Addresses from "../components/account/Addresses";
import Help from "../components/account/Help";

function AccountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view") || "profile";

  const [activeTab, setActiveTab] = useState(viewParam);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    setActiveTab(viewParam);
  }, [viewParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/account?view=${tab}`);
  };

  if (!user) return null;

  return (
    <main className="bg-white min-h-screen">

      {/* Header */}
      <section className="border-y border-gray-100 bg-white">

        <div className="max-w-[1180px] mx-auto px-5 py-10">

          <div className="flex items-center justify-center gap-2 text-[14px] text-gray-500">

            <Link
              href="/"
              className="hover:text-black transition"
            >
              Home
            </Link>

            <span>•</span>

            <span className="text-black">
              Account
            </span>

          </div>

          <h1 className="mt-3 text-center text-[46px] font-bold text-black">
            My Account
          </h1>

        </div>

      </section>

      {/* Content */}

      <section className="py-14">

        <div className="max-w-[1180px] mx-auto px-5">

          <div className="grid lg:grid-cols-[300px_1fr] gap-6">

            <AccountSidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />

            <div>

              {activeTab === "profile" && (
                <Profile user={user} />
              )}

              {activeTab === "orders" && (
                <Orders />
              )}

              {activeTab === "addresses" && (
                <Addresses />
              )}

              {(activeTab === "help" ||
                activeTab === "contact-details") && (
                <Help />
              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}