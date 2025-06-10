import React from "react";
import { BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TopMenu = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-200/50 px-4 lg:px-6 py-2">
        {/* Left section */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Combined clickable area */}
          <Link
            to="/"
            className="flex items-center space-x-3 min-w-0"
          >
            {/* Icon */}
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>

            {/* Label & description */}
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Sanchit
              </h1>
              <p className="text-xs text-orange-600 md:block">
                Monitor app activities across campuses
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopMenu;
