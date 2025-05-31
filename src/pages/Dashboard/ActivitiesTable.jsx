// src/components/ActivitiesTable.jsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// ← Import Badge from your UI library, not from lucide-react
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
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
}) {
  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription className="text-orange-600">
          Detailed list of all activities with advanced filtering (
          {filteredActivities.length} results)
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {/* ─── Advanced Filters (Search + User Filter) ─────────────────────────── */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Activities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by activity, user, or app..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Filter
              </label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.slice(0, 20).map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ─── Table ──────────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  APP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  CAMPUS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  ACTIVITY
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  USER
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  TIMESTAMP
                </th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  COUNT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {paginatedActivities.map((activity, idx) => (
                <tr
                  key={activity.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-orange-25"}
                >
                  {/* ID */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.id}
                  </td>

                  {/* APP as a colored badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className="bg-orange-50 text-orange-700 border border-orange-300 px-2 py-0.5 rounded-full text-xs">
                      {activity.app}
                    </Badge>
                  </td>

                  {/* CAMPUS as a colored badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className="bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded-full text-xs">
                      {activity.campus}
                    </Badge>
                  </td>

                  {/* ACTIVITY */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.activity}
                  </td>

                  {/* USER */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.user}
                  </td>

                  {/* TIMESTAMP */}
                  {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.timestamp}
                  </td> */}

                  {/* COUNT */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ──────────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, filteredActivities.length)} of{" "}
              {filteredActivities.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
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
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
