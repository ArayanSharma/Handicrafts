"use client";

import { useRouter } from "next/navigation";

export default function Profile({ user }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
    router.refresh();
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-8 pb-5">
        <h2 className="text-[38px] font-bold text-[#111827]">
          My Details
        </h2>
      </div>

      {/* Body */}
      <div>

        {/* Name */}
        <div className="grid grid-cols-2 items-center px-8 py-6 border-t border-gray-200">

          <span className="text-[18px] font-medium text-gray-500">
            Name
          </span>

          <span className="text-[18px] font-medium text-right text-gray-900">
            {user.firstName} {user.lastName}
          </span>

        </div>

        {/* Email */}
        <div className="grid grid-cols-2 items-center px-8 py-6 border-t border-gray-200">

          <span className="text-[18px] font-medium text-gray-500">
            Email ID
          </span>

          <span className="text-[18px] font-medium text-right text-gray-900 break-all">
            {user.email}
          </span>

        </div>

        {/* Logout */}
        <div className="flex justify-end px-8 py-6 border-t border-gray-200">

          <button
            onClick={logout}
            className="
              rounded-md
              bg-[#ffdddd]
              px-5
              py-2
              text-[15px]
              font-medium
              text-[#d63333]
              transition-all
              duration-300
              hover:bg-[#ffd0d0]
              hover:shadow-sm
            "
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}