// src/components/ActivitiesTable.jsx

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Table,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ActivitiesTable({
  tableRange,
  setTableRange,
  filteredActivities,
  paginatedActivities,
  totalPages,
  currentPage,
  setCurrentPage,
  clearFilters,
  searchTerm,
  setSearchTerm,
  selectedUser,
  setSelectedUser,
  uniqueUsers,
  selectedApp,
  setSelectedApp,
  selectedCampus,
  setSelectedCampus,
}) {
  const DATE_PRESETS = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last 30 Days", value: "last30" },
  ];
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  // Extract unique apps and campuses for filters
  const uniqueApps = [
    ...new Set(filteredActivities.map((activity) => activity.app)),
  ];
  const uniqueCampuses = [
    ...new Set(filteredActivities.map((activity) => activity.campus)),
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const clearAllFilters = () => {
    clearFilters();
    setSelectedApp("all");
    setSelectedCampus("all");
    setSortField("");
    setSortDirection("asc");
  };

  // Grid Card Component for mobile view
  const ActivityCard = ({ activity, index }) => (
    <div
      key={activity.id}
      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
        index % 2 === 0
          ? "bg-white border-orange-200"
          : "bg-orange-25 border-orange-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-900">
          ID: {activity.id}
        </div>
        <div className="text-lg font-semibold text-orange-600">
          {activity.count}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-orange-50 text-orange-700 border border-orange-300 px-2 py-0.5 rounded-full text-xs">
            {activity.app}
          </Badge>
          <Badge className="bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded-full text-xs">
            {activity.campus}
          </Badge>
        </div>

        <div className="text-sm text-gray-900">
          <div className="font-medium">{activity.activity}</div>
        </div>

        <div className="text-sm text-gray-600">User: {activity.user}</div>
      </div>
    </div>
  );

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Usage Details
            </CardTitle>
            <CardDescription className="text-orange-600">
              Detailed list of all activities
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 lg:p-0">
        <div className="flex justify-end px-6 pb-2 pt-4 mb-4">
          {/* --- DATE PRESETS for TABLE --- */}
          <div className="flex space-x-2">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setTableRange(preset.value);
                  setCurrentPage(1);
                  clearAllFilters();
                }}
                className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${
                      tableRange === preset.value
                        ? "bg-orange-600 text-white shadow-md transform scale-105"
                        : "bg-white/70 text-orange-700 hover:bg-white hover:shadow-sm border border-orange-300"
                    }
                  `}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* --- Existing view mode toggles --- */}
          {/* <div className="hidden sm:flex bg-white rounded-lg p-1 border border-orange-200">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={
                  viewMode === "table"
                    ? "bg-orange-600 hover:bg-orange-700 text-white h-8"
                    : "h-8"
                }
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-orange-600 hover:bg-orange-700 text-white h-8"
                    : "h-8"
                }
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div> */}

          {/* --- Filter Button --- */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 ml-2"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {showFilters && <X className="h-3 w-3 ml-1" />}
          </Button>
        </div>
        {/* ─── Collapsible Advanced Filters ─────────────────────────── */}
        {showFilters && (
          <div className="mb-6 p-4 bg-orange-25 rounded-lg border border-orange-200">
            <div className="space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Activities
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by activity, user, app, or campus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Filter
                  </label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="All Users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.slice(0, 20).map((user) => (
                        <SelectItem key={user} value={user}>
                          {user.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Filter
                  </label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="All Apps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Apps</SelectItem>
                      {uniqueApps.map((app) => (
                        <SelectItem key={app} value={app}>
                          {app}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus Filter
                  </label>
                  <Select
                    value={selectedCampus}
                    onValueChange={setSelectedCampus}
                  >
                    <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="All Campuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campuses</SelectItem>
                      {uniqueCampuses.map((campus) => (
                        <SelectItem key={campus} value={campus}>
                          {campus}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Content Display (Table or Grid) ──────────────────────────────────────── */}
        {viewMode === "table" ? (
          // Table View (Desktop)
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("id")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        ID {getSortIcon("id")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("app")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        APP {getSortIcon("app")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("campus")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        CAMPUS {getSortIcon("campus")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("activity")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        COURSE {getSortIcon("activity")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("user")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        USER {getSortIcon("user")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("count")}
                        className="flex items-center gap-1 hover:text-orange-900 transition-colors"
                      >
                        Activities {getSortIcon("count")}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {paginatedActivities.map((activity, idx) => (
                    <tr
                      key={activity.id}
                      className={`hover:bg-orange-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-orange-25"
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                        {activity.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className="bg-orange-50 text-orange-700 border border-orange-300 px-2 py-0.5 rounded-full text-xs">
                          {activity.app}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className="bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded-full text-xs">
                          {activity.campus}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                        {activity.activity.toUpperCase()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                        {activity.user.toUpperCase()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-gray-900">
                        {activity.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View (Mobile-friendly)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedActivities.map((activity, idx) => (
              <ActivityCard key={activity.id} activity={activity} index={idx} />
            ))}
          </div>
        )}

        {/* Mobile Table View (Responsive Cards) */}
        <div className="sm:hidden space-y-3">
          {paginatedActivities.map((activity, idx) => (
            <ActivityCard key={activity.id} activity={activity} index={idx} />
          ))}
        </div>

        {/* ─── Pagination ──────────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 order-2 sm:order-1">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, filteredActivities.length)} of{" "}
              {filteredActivities.length} results
            </div>

            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === pageNum
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "border-orange-300 text-orange-700 hover:bg-orange-50"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
