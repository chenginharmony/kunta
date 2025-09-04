import React, { useState } from "react";

const menuItems = [
  { name: "All Pools", href: "/all-pools", icon: "🏊" },
  { name: "Create Pool", href: "/create-pool", icon: "➕" },
  { name: "Quote Debug", href: "/quote-debug", icon: "🐞" },
  { name: "Leaderboard", href: "/leaderboard", icon: "🏆" },
  { name: "No Auction Pools", href: "/no-auction", icon: "🔄" },
  { name: "Create No Auction", href: "/create-no-auction", icon: "💫" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gray-900 text-white flex flex-col p-4 fixed top-0 left-0 z-40 shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={`text-2xl font-bold transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Kunta</span>
        <button
          className="ml-auto text-lg p-1 rounded hover:bg-gray-800"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
