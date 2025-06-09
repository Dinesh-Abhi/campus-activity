import React from "react";
import StatsCards from "./StatsCards";
import MobileStatsCards from "./MobileStatsCards";

const StatsOverview = ({ totalActivities, activeApps, campusesCount, avgUsage }) => {
  return (
    <div className="w-full">
      {/* Desktop Stats Cards */}
      <div className="hidden sm:block">
        <StatsCards
          totalActivities={totalActivities}
          activeApps={activeApps}
          campusesCount={campusesCount}
          avgUsage={avgUsage}
        />
      </div>

      {/* Mobile Stats Cards */}
      <div className="block sm:hidden">
        <MobileStatsCards
          totalActivities={totalActivities}
          activeApps={activeApps}
          campusesCount={campusesCount}
        />
      </div>
    </div>
  );
};

export default StatsOverview;
