import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart,
  Download,
  Settings,
  Building,
  Grid,
  User,
} from "lucide-react";

const campuses = ["Kmit Campus", "Ngit/Kmec Campus", "kmce Campus"];
const apps = [
  "TESSELLATOR",
  "TOOFAAN",
  "BETAAL",
  "PRASHNAMANCH",
  "TANTRIK",
  "TESSERACT",
];
const users = ["User 1", "User 2"];

const Sidebar = ({ collapsed }) => {
  return (
    <div
      className={`flex flex-col bg-white border-r border-orange-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{ height: "auto", minHeight: "100%" }} // Allow sidebar to stretch fully
    >
      {/* Make nav flex-1 to fill full height */}
      <nav className="flex-1 pt-4">
        {/* Main */}
        <Section
          title={!collapsed && "Main"}
          items={[
            { label: "Dashboard", icon: <Home size={18} />, to: "/" },
            { label: "Reports", icon: <BarChart size={18} />, to: "/reports" },
            { label: "Export", icon: <Download size={18} />, to: "/export" },
            {
              label: "Settings",
              icon: <Settings size={18} />,
              to: "/settings",
            },
          ]}
          collapsed={collapsed}
        />

        {/* Campus */}
        <Section
          title={!collapsed && "Campus"}
          items={campuses.map((campus) => ({
            label: campus,
            icon: <Building size={18} />,
            to: `/campus/${campus.toLowerCase().replace(/\s/g, "")}`,
          }))}
          collapsed={collapsed}
        />

        {/* Apps */}
        <Section
          title={!collapsed && "Apps"}
          items={apps.map((app) => ({
            label: app,
            icon: <Grid size={18} />,
            to: `/apps/${app.toLowerCase()}`,
          }))}
          collapsed={collapsed}
        />

        {/* Users */}
        <Section
          title={!collapsed && "Users"}
          items={users.map((user) => ({
            label: user,
            icon: <User size={18} />,
            to: `/users/${user.toLowerCase().replace(/\s/g, "")}`,
          }))}
          collapsed={collapsed}
        />
      </nav>
    </div>
  );
};

const Section = ({ title, items, collapsed }) => {
  return (
    <div className="px-2 py-3">
      {title && (
        <h3 className="text-xs font-semibold text-orange-500 uppercase mb-2 whitespace-nowrap">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map(({ label, icon, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 hover:bg-orange-100 text-orange-700 ${
                  isActive ? "bg-orange-200 font-semibold text-orange-900" : ""
                }`
              }
              title={collapsed ? label : ""}
            >
              {icon}
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
