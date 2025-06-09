import React from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeaderSection = ({
  appsCount,
  campusesCount,
  onRefresh,
  isLoading,
  lastRefresh,
}) => (
  <div className="bg-white border-b border-orange-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sanchit
            </h1>
            <p className="text-orange-600">Monitor app activities across campuses</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            {appsCount} Apps • {campusesCount} Campuses
          </Badge>
          <Button
            onClick={onRefresh}
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default HeaderSection;
