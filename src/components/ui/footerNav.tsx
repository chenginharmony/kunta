import React from "react";

const menuItems = [
  { name: "All Pools", href: "/all-pools", icon: "🏊" },
  { name: "Create Pool", href: "/create-pool", icon: "➕" },
  { name: "Quote Debug", href: "/quote-debug", icon: "🐞" },
];

export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-2 z-50 md:hidden shadow-t">
      {menuItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="flex flex-col items-center gap-1 px-2 py-1 hover:bg-gray-800 rounded transition-colors"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs">{item.name}</span>
        </a>
      ))}
    </nav>
  );
}
