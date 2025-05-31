import React, { useState, useMemo, useEffect } from "react";
import HeaderSection from "./HeaderSection";
import DashboardControls from "./DashboardControls";
import StatsCards from "./StatsCards";
import ActivitiesByCampusChart from "./ActivitiesByCampusChart";
import AppUsagePieChart from "./AppUsagePieChart";
import CampusComparisonBarChart from "./CampusComparisonBarChart";
import ActivitiesTable from "./ActivitiesTable";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSanchithData,
  SanchitDashboardTableData,
} from "@/redux/drugmodailities/actionCreator";

const APPS = [
  "TESSELLATOR",
  "TOOFAAN",
  "BETAAL",
  "PRASHNAMANCH",
  "TANTRIK",
  "TESSERACT",
];
const CAMPUSES = ["K", "N", "I"];

// Warm color palette
const WARM_COLORS = {
  primary: "#D97706", // Amber-600
  secondary: "#DC2626", // Red-600
  accent: "#EA580C", // Orange-600
  tertiary: "#B45309", // Amber-700
  quaternary: "#F59E0B", // Amber-500
  quinary: "#EF4444", // Red-500
};

const APP_COLORS = [
  "#D97706", // Amber-600
  "#DC2626", // Red-600
  "#EA580C", // Orange-600
  "#B45309", // Amber-700
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
];

const DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last7" },
  { label: "Last 30 days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
];

// Mock data generator
const generateMockData = (date) => {
  const data = [];
  for (const campus of CAMPUSES) {
    for (const app of APPS) {
      const activities = Math.floor(Math.random() * 50) + 10;
      data.push({
        campus,
        app,
        activities,
        date,
        avgUsage: Math.floor(Math.random() * 100) + 20,
      });
    }
  }
  return data;
};

const generateActivityList = () => {
  const activities = [];
  for (let i = 1; i <= 100; i++) {
    activities.push({
      id: i,
      app: APPS[Math.floor(Math.random() * APPS.length)],
      campus: CAMPUSES[Math.floor(Math.random() * CAMPUSES.length)],
      activity: `Activity ${i}`,
      user: `User${Math.floor(Math.random() * 100) + 1}`,
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toLocaleString(),
      status: Math.random() > 0.5 ? "Completed" : "In Progress",
    });
  }
  return activities;
};

const getDateFromPreset = (preset) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  switch (preset) {
    case "today":
      return today.toISOString().split("T")[0];
    case "yesterday":
      return yesterday.toISOString().split("T")[0];
    case "last7":
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      return last7.toISOString().split("T")[0];
    case "last30":
      const last30 = new Date(today);
      last30.setDate(last30.getDate() - 30);
      return last30.toISOString().split("T")[0];
    case "thisMonth":
      return new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    case "lastMonth":
      return new Date(today.getFullYear(), today.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
    default:
      return today.toISOString().split("T")[0];
  }
};

const Index = () => {
  // All your state, dispatch, useEffects, data transformations here (same as before)

  // Pass all necessary data and handlers as props to components
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetSanchithData());
    dispatch(SanchitDashboardTableData());
  }, [dispatch]);
  const {
    GetSanchithDatares,
    SanchithDataLoading,
    tableSanchitData,
    tableSanchitDataLoading,
  } = useSelector((state) => ({
    GetSanchithDatares: state.getDrugModalitiesReducerRes.data,
    SanchithDataLoading: state.getDrugModalitiesReducerRes.loading,
    tableSanchitData: state.getSanchitTableReducerRes.data,
    tableSanchitDataLoading: state.getSanchitTableReducerRes.loading,
  }));

  console.log("tableSanchitData", tableSanchitData);

  const [showFilters, setShowFilters] = useState(false);

  // Inside your component
  const transformedComparisonData = useMemo(() => {
    if (!GetSanchithDatares || !GetSanchithDatares.sessions) return [];

    const sessions = GetSanchithDatares.sessions;
    const appsSet = new Set();

    // Get all apps
    Object.values(sessions).forEach((campusApps) => {
      Object.keys(campusApps).forEach((app) => appsSet.add(app));
    });

    const appsArray = Array.from(appsSet);
    const campusKeys = Object.keys(sessions); // dynamic campus keys

    return appsArray.map((app) => {
      const obj = { app };
      campusKeys.forEach((campus) => {
        obj[campus] = sessions[campus][app] || 0;
      });
      return obj;
    });
  }, [GetSanchithDatares]);
  const activitiesByCampus = useMemo(() => {
    if (!GetSanchithDatares || !GetSanchithDatares.sessions) return [];

    const sessions = GetSanchithDatares.sessions;

    return Object.entries(sessions).map(([campus, apps]) => {
      const totalActivities = Object.values(apps).reduce(
        (sum, count) => sum + count,
        0
      );
      return { campus, activities: totalActivities };
    });
  }, [GetSanchithDatares]);
  const apiappData = useMemo(() => {
    if (!GetSanchithDatares || !GetSanchithDatares.sessions) return [];

    const sessions = GetSanchithDatares.sessions;
    const appTotals = {};

    // Sum across all campuses for each app
    Object.values(sessions).forEach((campusApps) => {
      Object.entries(campusApps).forEach(([app, count]) => {
        appTotals[app] = (appTotals[app] || 0) + count;
      });
    });

    // Convert to array of objects for recharts
    return Object.entries(appTotals).map(([app, activities]) => ({
      app,
      activities,
    }));
  }, [GetSanchithDatares]);

  // ─── State for Filters / Search / Pagination ────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Transform raw `tableSanchitData` into exactly the shape the table expects ──
  const activities = useMemo(() => {
    if (!tableSanchitData) return [];

    return tableSanchitData.map((item) => ({
      id: item.id,
      app: item.app,
      campus: item.campus,
      activity: item.course,
      user: item.teacher,
      count: item.count,
    }));
  }, [tableSanchitData]);

  // ─── Unique users for dropdown filter ────────────────────────────────────────
  const uniqueUsers = useMemo(() => {
    const setUsers = new Set(activities.map((a) => a.user));
    return [...setUsers];
  }, [activities]);

  // ─── Filter by searchTerm & user ─────────────────────────────────────────────
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesSearch =
        act.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.app.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser = selectedUser === "all" || act.user === selectedUser;
      return matchesSearch && matchesUser;
    });
  }, [activities, searchTerm, selectedUser]);

  // ─── Pagination logic ───────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUser("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* <HeaderSection
        appsCount={APPS.length}
        campusesCount={CAMPUSES.length}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastRefresh={lastRefresh}
      /> */}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* <DashboardControls
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          selectedCampus={selectedCampus}
          onCampusChange={setSelectedCampus}
          selectedApp={selectedApp}
          onAppChange={setSelectedApp}
          onExport={handleExport}
          isLoading={isLoading}
          datePresets={DATE_PRESETS}
          onDatePresetClick={handleDatePreset}
          campuses={CAMPUSES}
          apps={APPS}
        /> */}
        {/* 
        <StatsCards
          totalActivities={mockData.reduce((sum, d) => sum + d.activities, 0)}
          activeApps={APPS.length}
          campusesCount={CAMPUSES.length}
          avgUsage={Math.round(
            mockData.reduce((sum, d) => sum + d.avgUsage, 0) / mockData.length
          )}
        /> */}
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivitiesByCampusChart data={activitiesByCampus} />
          <AppUsagePieChart data={apiappData} />
        </div> */}

        <CampusComparisonBarChart
          data={transformedComparisonData}
          campusKeys={
            GetSanchithDatares ? Object.keys(GetSanchithDatares.sessions) : []
          }
        />

        <ActivitiesTable
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
        />
      </div>
    </div>
  );
};

export default Index;
