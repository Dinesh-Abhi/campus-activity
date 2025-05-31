import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Database, Users, TrendingUp } from "lucide-react";

const StatsCards = ({ totalActivities, activeApps, campusesCount, avgUsage }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card className="border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Activities</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {totalActivities}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Apps</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">
              {activeApps}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <Database className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Campuses</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">{campusesCount}</p>
          </div>
          <div className="p-3 bg-amber-100 rounded-full">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Usage</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{avgUsage}%</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StatsCards;
