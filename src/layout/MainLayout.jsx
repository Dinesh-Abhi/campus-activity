import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import TopMenu from "./TopMenu";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Close overlay on medium and up
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      // For medium screens and up, collapse/expand
      setCollapsed((prev) => !prev);
    } else {
      // For small screens, toggle overlay
      setSidebarOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Top Header */}
      <TopMenu toggleSidebar={toggleSidebar} />

      {/* Body */}
      <div className="flex flex-1 min-h-0 w-full relative">
        <Sidebar
          collapsed={collapsed}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="flex-1 min-h-0 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
