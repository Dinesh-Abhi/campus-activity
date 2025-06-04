import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart3,
  Download,
  Building2,
  AppWindow,
  Users,
  School,
  GraduationCap,
  Building,
  Zap,
  Shield,
  MessageSquare,
  Settings,
  Hexagon,
  User,
  UserCheck,
} from "lucide-react";

const campuses = ["KMIT", "NGIT/KMEC", "KMCE"];
const apps = [
  "TESSELLATOR",
  "TOOFAAN",
  "BETAAL",
  "PRASHNAMANCH",
  "TANTRIK",
  "TESSERACT",
];
const users = ["USER 1", "USER 2"];

// Icon mapping for apps
const getAppIcon = (appName) => {
  const iconMap = {
    TESSELLATOR: <Hexagon size={16} />,
    TOOFAAN: <Zap size={16} />,
    BETAAL: <Shield size={16} />,
    PRASHNAMANCH: <MessageSquare size={16} />,
    TANTRIK: <Settings size={16} />,
    TESSERACT: <AppWindow size={16} />,
  };
  return iconMap[appName] || <AppWindow size={16} />;
};

// Icon mapping for campuses
const getCampusIcon = (campusName) => {
  const iconMap = {
    KMIT: <School size={16} />,
    "NGIT/KMEC": <School size={16} />,
    KMCE: <School size={16} />,
  };
  return iconMap[campusName] || <GraduationCap size={16} />;
};

const Sidebar = ({ collapsed, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          flex flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200/60
          transition-all duration-300 ease-in-out
          ${collapsed ? "md:w-14" : "md:w-60"}
          ${
            isOpen
              ? "w-60 translate-x-0"
              : "w-60 -translate-x-full md:translate-x-0"
          }
        `}
        style={{ height: "auto", minHeight: "100%" }}
      >
        {/* Navigation */}
        <nav className="flex-1 pt-2 pb-4">
          {/* Main */}
          <Section
            title={!collapsed ? "Main" : null}
            items={[
              { label: "Dashboard", icon: <Home size={16} />, to: "/" },
              {
                label: "Reports",
                icon: <BarChart3 size={16} />,
                to: "/reports",
              },
              { label: "Export", icon: <Download size={16} />, to: "/export" },
            ]}
            collapsed={collapsed}
            onClose={onClose}
          />

          {/* Campus */}
          <Section
            title={!collapsed ? "Campus" : null}
            items={campuses.map((campus) => ({
              label: campus,
              icon: getCampusIcon(campus),
              to: `/campus/${campus.toLowerCase().replace(/\s/g, "")}`,
            }))}
            collapsed={collapsed}
            onClose={onClose}
            defaultIcon={<School size={16} />} // <-- Shared icon here
          />

          {/* Apps */}
          <Section
            title={!collapsed ? "Apps" : null}
            items={apps.map((app) => ({
              label: app,
              icon: getAppIcon(app),
              to: `/apps/${app.toLowerCase()}`,
            }))}
            collapsed={collapsed}
            onClose={onClose}
          />

          {/* Users */}
          <Section
            title={!collapsed ? "Users" : null}
            items={users.map((user, index) => ({
              label: user,
              icon: index === 0 ? <User size={16} /> : <UserCheck size={16} />,
              to: `/users/${user.toLowerCase().replace(/\s/g, "")}`,
            }))}
            collapsed={collapsed}
            onClose={onClose}
          />
        </nav>
      </div>
    </>
  );
};

const Section = ({ title, items, collapsed, onClose, defaultIcon }) => {
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  return (
    <div className={`${collapsed ? "px-1 py-2" : "px-3 py-2"}`}>
      {title && (
        <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
          {title}
        </h3>
      )}
      <ul className="space-y-0.5">
        {items.map(({ label, icon, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 text-gray-700 ${
                  isActive
                    ? "bg-orange-50 text-orange-700 border-r-2 border-orange-600"
                    : "hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? label : ""}
            >
              <span className="flex-shrink-0 text-gray-500 group-hover:text-current">
                {collapsed && defaultIcon ? defaultIcon : icon}
              </span>
              {!collapsed && <span className="truncate text-sm">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
