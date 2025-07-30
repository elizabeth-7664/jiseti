// src/components/shared/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, FilePlus, LayoutDashboard, User } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports", icon: FilePlus },
  { to: "/admin", label: "Admin Panel", icon: Shield },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 space-y-4">
      <h1 className="text-xl font-bold mb-6">Jiseti</h1>
      <nav className="flex flex-col space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            to={to}
            key={to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded hover:bg-gray-800 transition ${
                isActive ? "bg-gray-800" : ""
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;