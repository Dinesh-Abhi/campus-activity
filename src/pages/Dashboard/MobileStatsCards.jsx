import React from "react";
import { Activity, Database, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CardItem = ({ label, value, icon: Icon, gradientFrom, gradientTo }) => {
  return (
    <Card className="flex-shrink-0 w-[65vw] rounded-xl shadow-sm border-0 bg-white transition-transform duration-200 active:scale-95">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
          <div
            className={`p-3 rounded-full bg-gradient-to-br from-${gradientFrom} to-${gradientTo} text-white`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MobileStatsCards = ({ totalActivities, activeApps, campusesCount }) => {
  return (
    <div className="sm:hidden flex space-x-3 overflow-x-auto px-4 py-4 snap-x snap-mandatory">
      <div className="snap-start">
        <CardItem
          label="Total Activities"
          value={totalActivities}
          icon={Activity}
          gradientFrom="orange-400"
          gradientTo="orange-600"
        />
      </div>
      <div className="snap-start">
        <CardItem
          label="Active Apps"
          value={activeApps}
          icon={Database}
          gradientFrom="rose-400"
          gradientTo="red-600"
        />
      </div>
      <div className="snap-start">
        <CardItem
          label="Campuses"
          value={campusesCount}
          icon={Users}
          gradientFrom="amber-400"
          gradientTo="amber-600"
        />
      </div>
    </div>
  );
};

export default MobileStatsCards;
