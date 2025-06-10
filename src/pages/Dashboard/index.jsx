// src/pages/Index.jsx
import React, { useState, useMemo, useEffect } from "react";
import StatsCards from "./StatsCards";
import MobileStatsCards from "./MobileStatsCards";
import ActivitiesByCampusChart from "./ActivitiesByCampusChart";
import AppUsagePieChart from "./AppUsagePieChart";
import AppCampusComparisonBarChart from "@/pages/Dashboard/AppCampusComparisonBarChart";
import ActivitiesTable from "./ActivitiesTable";
import MainConstants from "@/components/constants/MainConstants";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSanchithData,
  SanchitDashboardTableData,
} from "@/redux/dashboard/actionCreator";
import Main from "@/components/custom/Main";

const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
];

// Skeleton Components
const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    <div className="h-80 bg-gray-100 rounded-lg"></div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border animate-pulse">
    <div className="p-6 border-b">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-5 gap-4 mb-4 pb-2 border-b">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100"
        >
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-100 rounded"></div>
          ))}
        </div>
      ))}
      <div className="flex justify-between items-center mt-6">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  </div>
);

// Coming Soon Card
const ComingSoon = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-sm border">
    <div className="text-4xl mb-4">🚧</div>
    <div className="text-xl font-semibold">{label} - Coming Soon!</div>
  </div>
);

const TABS = [
  { label: "Apps Usage", key: "apps" },
  { label: "Activities", key: "activities" },
  { label: "Faculty", key: "faculty" },
  { label: "Reports", key: "reports" },
];

const Index = () => {
  const dispatch = useDispatch();
  const CAMPUS_KEYS = Object.values(MainConstants.COLLEGES);

  // Tab State
  const [activeTab, setActiveTab] = useState("apps");

  // Dashboard Data State
  const [selectedRange, setSelectedRange] = useState("today");
  const [tableRange, setTableRange] = useState("today");

  useEffect(() => {
    dispatch(GetSanchithData(selectedRange));
  }, [dispatch, selectedRange]);

  useEffect(() => {
    dispatch(SanchitDashboardTableData(tableRange));
  }, [dispatch, tableRange]);

  const {
    GetSanchithDatares,
    SanchithDataLoading,
    tableSanchitData,
    tableSanchitDataLoading,
  } = useSelector((state) => ({
    GetSanchithDatares: state.getSanchitDashboardChartsRes.data,
    SanchithDataLoading: state.getSanchitDashboardChartsRes.loading,
    tableSanchitData: state.getSanchitTableReducerRes.data,
    tableSanchitDataLoading: state.getSanchitTableReducerRes.loading,
  }));

  const transformedComparisonData = useMemo(() => {
    if (!GetSanchithDatares?.sessions) return [];
    const sessions = GetSanchithDatares.sessions;

    const campusKeys = CAMPUS_KEYS.filter((key) => key in sessions);

    const appsSet = new Set();
    Object.values(sessions).forEach((campusApps) => {
      Object.keys(campusApps).forEach((app) => appsSet.add(app));
    });
    const appsArray = Array.from(appsSet);

    return appsArray.map((app) => {
      const row = { app };
      campusKeys.forEach((campus) => {
        row[campus] = sessions[campus][app] || 0;
      });
      return row;
    });
  }, [GetSanchithDatares]);

  const activities = useMemo(() => {
    if (!tableSanchitData || !Array.isArray(tableSanchitData)) return [];
    return tableSanchitData.map((item) => ({
      id: item.id,
      app: item.app,
      campus: item.campus,
      activity: item.course,
      user: item.teacher,
      count: item.count,
    }));
  }, [tableSanchitData]);

  const uniqueUsers = useMemo(() => {
    const setU = new Set(activities.map((a) => a.user));
    return Array.from(setU);
  }, [activities]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState("all");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const itemsPerPage = 10;

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.campus.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = selectedUser === "all" || act.user === selectedUser;
      const matchesApp = selectedApp === "all" || act.app === selectedApp;
      const matchesCampus =
        selectedCampus === "all" || act.campus === selectedCampus;
      return matchesSearch && matchesUser && matchesApp && matchesCampus;
    });
  }, [activities, searchTerm, selectedUser, selectedApp, selectedCampus]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUser("all");
    setSelectedApp("all");
    setSelectedCampus("all");
  };

  const stackedChartData = useMemo(() => {
    if (!GetSanchithDatares?.college_wise?.sessions) return [];

    const campusMap = {};
    CAMPUS_KEYS.forEach((campus) => {
      campusMap[campus.toLowerCase()] = campus;
    });

    const days = Object.keys(GetSanchithDatares.college_wise.sessions);
    days.sort((a, b) => new Date(a) - new Date(b));

    return days.map((day, i) => {
      const dayData = GetSanchithDatares.college_wise.sessions[day];
      const result = { day, index: i + 1 };
      Object.entries(campusMap).forEach(([key, displayKey]) => {
        result[displayKey] = dayData[key] || 0;
      });
      return result;
    });
  }, [GetSanchithDatares]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden`}>
      <div className="relative z-10 max-w-8xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-2">

        {/* Header Cards - visible always */}
        {/* <MobileStatsCards
        totalActivities={GetSanchithDatares?.summary?.total_sessions ?? 0}
        activeApps={GetSanchithDatares?.summary?.active_apps ?? 0}
        campusesCount={
          GetSanchithDatares?.sessions
            ? Object.keys(GetSanchithDatares.sessions).length
            : 0
        }
      />
      <div className="hidden sm:block">
        <StatsCards
          totalActivities={GetSanchithDatares?.summary?.total_sessions ?? 0}
          activeApps={GetSanchithDatares?.summary?.active_apps ?? 0}
          campusesCount={
            GetSanchithDatares?.sessions
              ? Object.keys(GetSanchithDatares.sessions).length
              : 0
          }
          avgUsage="0"
        />
      </div> */}

        {/* Tabs */}
        {/* Mobile-friendly Tabs */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="sm:hidden border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 overflow-x-auto scrollbar-hide px-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Desktop: Regular tabs */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="-mb-px flex space-x-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${activeTab === tab.key
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>


        {/* Tab Content */}
        <div className="px-1 sm:px-0">
          {activeTab === "apps" && (
            <div>
              {SanchithDataLoading ? (
                <ChartSkeleton />
              ) : (
                <AppCampusComparisonBarChart
                  data={
                    selectedRange === "today"
                      ? transformedComparisonData
                      : stackedChartData
                  }
                  campusKeys={CAMPUS_KEYS}
                  datePresets={DATE_PRESETS}
                  selectedRange={selectedRange}
                  onRangeChange={(newRange) => {
                    setSelectedRange(newRange);
                    setCurrentPage(1);
                  }}
                  chartType={selectedRange === "today" ? "grouped" : "stacked"}
                />
              )}
            </div>
          )}
          {activeTab === "activities" && (
            <div className="sm:text-xs p-2 sm:p-1 max-h-[80vh] overflow-y-auto">
              {tableSanchitDataLoading ? (
                <TableSkeleton />
              ) : (
                <ActivitiesTable
                  tableRange={tableRange}
                  setTableRange={setTableRange}
                  filteredActivities={filteredActivities}
                  paginatedActivities={paginatedActivities}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  clearFilters={clearFilters}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  uniqueUsers={uniqueUsers}
                  selectedApp={selectedApp}
                  setSelectedApp={setSelectedApp}
                  selectedCampus={selectedCampus}
                  setSelectedCampus={setSelectedCampus}
                />
              )}
            </div>
          )}
          {activeTab === "faculty" && <ComingSoon label="Faculty" />}
          {activeTab === "reports" && <ComingSoon label="Reports" />}
        </div>
      </div>
    </div>
  );
};

export default Index;
