import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  FileText,
  Database,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { GetSanchithData } from "@/redux/dashboard/actionCreator";

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetSanchithData());
  }, [dispatch]);
  const { GetSanchithDatares, SanchithDataLoading } = useSelector((state) => ({
    GetSanchithDatares: state.getSanchitDashboardChartsRes.data,
    SanchithDataLoading: state.getSanchitDashboardChartsRes.loading,
  }));
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [selectedApp, setSelectedApp] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const itemsPerPage = 10;

  const mockData = useMemo(
    () => generateMockData(selectedDate),
    [selectedDate]
  );
  const activityList = useMemo(() => generateActivityList(), []);

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = [...new Set(activityList.map((activity) => activity.user))];
    return users.sort();
  }, [activityList]);

  // Process data for charts
  const campusData = useMemo(() => {
    const processed = CAMPUSES.map((campus) => {
      const campusActivities = mockData.filter((d) => d.campus === campus);
      const total = campusActivities.reduce((sum, d) => sum + d.activities, 0);
      return { campus, activities: total };
    });
    return processed;
  }, [mockData]);

  const appData = useMemo(() => {
    return APPS.map((app) => {
      const appActivities = mockData.filter((d) => d.app === app);
      const total = appActivities.reduce((sum, d) => sum + d.activities, 0);
      return { app, activities: total };
    });
  }, [mockData]);

  const comparisonData = useMemo(() => {
    return APPS.map((app) => {
      const result = { app };
      CAMPUSES.forEach((campus) => {
        const activity = mockData.find(
          (d) => d.app === app && d.campus === campus
        );
        result[campus] = activity ? activity.activities : 0;
      });
      return result;
    });
  }, [mockData]);

  // Filter and paginate activities
  const filteredActivities = useMemo(() => {
    return activityList.filter((activity) => {
      const campusMatch =
        selectedCampus === "all" || activity.campus === selectedCampus;
      const appMatch = selectedApp === "all" || activity.app === selectedApp;
      const statusMatch =
        selectedStatus === "all" || activity.status === selectedStatus;
      const userMatch =
        selectedUser === "all" || activity.user === selectedUser;
      const searchMatch =
        searchTerm === "" ||
        activity.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.app.toLowerCase().includes(searchTerm.toLowerCase());

      return campusMatch && appMatch && statusMatch && userMatch && searchMatch;
    });
  }, [
    activityList,
    selectedCampus,
    selectedApp,
    selectedStatus,
    selectedUser,
    searchTerm,
  ]);

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredActivities.slice(start, end);
  }, [filteredActivities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const handleExport = (format) => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates for export",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Export Started",
        description: `Exporting data from ${startDate} to ${endDate} as ${format.toUpperCase()}`,
      });
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefresh(new Date());
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated",
      });
    }, 1000);
  };

  const handleDatePreset = (preset) => {
    const newDate = getDateFromPreset(preset);
    setSelectedDate(newDate);
  };

  const clearFilters = () => {
    setSelectedCampus("all");
    setSelectedApp("all");
    setSelectedStatus("all");
    setSelectedUser("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
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
                {APPS.length} Apps • {CAMPUSES.length} Campuses
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Controls */}
        <Card className="border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dashboard Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Date Presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Date Selection
              </label>
              <div className="flex flex-wrap gap-2">
                {DATE_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDatePreset(preset.value)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Export)
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Export)
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campuses</SelectItem>
                    {CAMPUSES.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        Campus {campus}
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Apps</SelectItem>
                    {APPS.map((app) => (
                      <SelectItem key={app} value={app}>
                        {app}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Data
                </label>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleExport("csv")}
                    size="sm"
                    disabled={!startDate || !endDate || isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    size="sm"
                    disabled={!startDate || !endDate || isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Activities
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {mockData.reduce((sum, d) => sum + d.activities, 0)}
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Apps
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {APPS.length}
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
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                    {CAMPUSES.length}
                  </p>
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
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {Math.round(
                      mockData.reduce((sum, d) => sum + d.avgUsage, 0) /
                        mockData.length
                    )}
                    %
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campus Activities */}
          <Card className="border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
              <CardTitle className="text-orange-800">
                Activities by Campus
              </CardTitle>
              <CardDescription className="text-orange-600">
                Total activities by campus
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                {activitiesByCampus && activitiesByCampus.length > 0 ? (
                  <BarChart data={activitiesByCampus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                    <XAxis dataKey="campus" stroke="#ea580c" />
                    <YAxis stroke="#ea580c" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="activities"
                      fill="#d97706"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-[300px] border border-dashed border-red-200 bg-red-50 rounded-md text-red-500 font-medium">
                    No session available
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* App Usage Distribution */}
          <Card className="border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-100 to-orange-100">
              <CardTitle className="text-red-800">
                App Usage Distribution
              </CardTitle>
              <CardDescription className="text-red-600">
                Activities by application
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {apiappData && apiappData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={apiappData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="activities"
                      nameKey="app"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {apiappData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={APP_COLORS[index % APP_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] border border-dashed border-red-200 bg-red-50 rounded-md text-red-500 font-medium">
                  No session available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campus Comparison */}
        <Card className="border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
            <CardTitle className="text-amber-800">
              Campus Comparison by App
            </CardTitle>
            <CardDescription className="text-amber-600">
              Compare app usage across all campuses
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {transformedComparisonData &&
            transformedComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={transformedComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                  <XAxis
                    dataKey="app"
                    stroke="#d97706"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis stroke="#d97706" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                    }}
                  />

                  {GetSanchithDatares &&
                    Object.keys(GetSanchithDatares.sessions).map(
                      (campusKey, idx) => {
                        const colors = [
                          "#d97706",
                          "#dc2626",
                          "#ea580c",
                          "#fbbf24",
                          "#84cc16",
                        ];
                        return (
                          <Bar
                            key={campusKey}
                            dataKey={campusKey}
                            fill={colors[idx % colors.length]}
                            name={campusKey}
                            radius={[2, 2, 0, 0]}
                          />
                        );
                      }
                    )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[400px] border border-dashed border-amber-300 bg-amber-50 rounded-md text-amber-600 font-medium">
                No session available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activities List with Enhanced Filtering */}
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
            {/* Advanced Filters */}
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
                    Status Filter
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      App
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      Campus
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {paginatedActivities.map((activity, index) => (
                    <tr
                      key={activity.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-orange-25"}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="border-orange-300 text-orange-700"
                        >
                          {activity.app}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="border-red-300 text-red-700"
                        >
                          Campus {activity.campus}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.activity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.user}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.timestamp}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            activity.status === "Completed"
                              ? "default"
                              : "outline"
                          }
                          className={
                            activity.status === "Completed"
                              ? "bg-orange-100 text-orange-800 border-orange-300"
                              : "border-amber-300 text-amber-700"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredActivities.length
                  )}{" "}
                  of {filteredActivities.length} results
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
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
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
      </div>
    </div>
  );
};

export default Index;
