import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer"; // Your footer component
import { Outlet } from "react-router-dom";
import { BarChart3, RefreshCw, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [collapsed, setCollapsed] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-20 w-full">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="p-2 rounded hover:bg-gray-100 text-orange-600"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
              Campus Analytics Dashboard
            </h1>
            <p className="text-orange-600">
              Monitor app activities across campuses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-orange-300 text-orange-700"
          >
            6 Apps • 3 Campuses
          </Badge>
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Body (Sidebar + Main Content) */}
      <div className="flex flex-1 min-h-0 w-full">
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
