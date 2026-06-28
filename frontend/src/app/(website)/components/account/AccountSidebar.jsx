"use client";

import {
  User,
  Package,
  MapPin,
  PhoneCall,
} from "lucide-react";

export default function AccountSidebar({
  activeTab,
  setActiveTab,
}) {
  const menus = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
    },
    {
      id: "addresses",
      label: "My Addresses",
      icon: MapPin,
    },
    {
      id: "contact-details",
      label: "Any Query?",
      icon: PhoneCall,
    },
  ];

  return (
    <aside className="w-full bg-white">
      {menus.map((item, index) => {
        const Icon = item.icon;

        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              relative
              w-full
              flex
              items-center
              gap-5
              px-10
              py-9
              text-left
              transition-all
              duration-300
              border-b
              border-gray-200
              group
              ${index === menus.length - 1 ? "border-b-0" : ""}
            `}
          >
            {/* Active Line */}
            {active && (
              <span className="absolute left-0 bottom-0 h-[3px] w-full bg-[#0F5A37]" />
            )}

            <Icon
              size={34}
              strokeWidth={1.6}
              className={active ? "text-[#0F5A37]" : "text-gray-500"}
            />

            <span
              className={`
                text-[22px]
                transition
                ${
                  active
                    ? "font-medium text-[#0F5A37]"
                    : "font-normal text-[#4B5563] group-hover:text-black"
                }
              `}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}