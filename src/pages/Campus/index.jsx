// EventUsageChart.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  LabelList,
  Brush,
} from "recharts";
import { useParams } from "react-router-dom";
import { GetCampusAppsUsageData } from "@/redux/college/actionCreator";
import { APP_COLORS, COLLEGE_COLORS } from "@/components/constants/Color";
import { useDispatch, useSelector } from "react-redux";
import MainConstants from "@/components/constants/MainConstants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CustomBar = (props) => {
  const { x, y, width, height, value, fill, onClick } = props;
  return (
    <g onClick={() => onClick(value)}>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {value === 0 && <circle cx={x + width / 2} cy={y - 5} r={4} fill="red" />}
    </g>
  );
};

const EventUsageChart = () => {
  const { college } = useParams();
  const dispatch = useDispatch();

  // Map url param to display college name
  const COLLEGES_MAP = Object.values(MainConstants.COLLEGES).reduce(
    (map, college) => {
      map[college.toLowerCase().replace(/\s/g, "")] = college;
      return map;
    },
    {}
  );
  const displayCollege =
    COLLEGES_MAP[college] || college?.toUpperCase() || "College";

  // Enhanced modern color themes inspired by Claude UI
  const COLLEGE_THEMES = {
    // default: {
    //   primary: "from-slate-900 to-slate-700",
    //   secondary: "from-gray-50 to-slate-100",
    //   accent: "bg-slate-600",
    //   text: "text-slate-700",
    //   border: "border-slate-200",
    //   hover: "hover:from-slate-800 hover:to-slate-600",
    //   glow: "shadow-slate-500/20",
    //   card: "bg-white/70 backdrop-blur-sm border-slate-200/50",
    // },
    default: {
      primary: "from-slate-900 to-slate-700",
      secondary: "from-orange-50 to-orange-100",
      accent: "bg-slate-600",
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:from-orange-600 hover:to-orange-500",
      glow: "shadow-orange-500/20",
      card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    },
    // kmit: {
    //   primary: `from-[${COLLEGE_COLORS.KMIT}] to-[${COLLEGE_COLORS.KMIT}]`, // Teal
    //   secondary: "from-teal-50 to-teal-100",
    //   accent: `bg-[${COLLEGE_COLORS.KMIT}]`, // Teal
    //   text: "text-teal-700",
    //   border: "border-teal-200",
    //   hover: "hover:from-teal-700 hover:to-teal-600",
    //   glow: "shadow-teal-500/20",
    //   card: "bg-teal-50/70 backdrop-blur-sm border-teal-200/50",
    // },
    // ngit: {
    //   primary: `from-[${COLLEGE_COLORS.NGIT}] to-[${COLLEGE_COLORS.NGIT}]`, // Orange
    //   secondary: "from-orange-50 to-orange-100",
    //   accent: `bg-[${COLLEGE_COLORS.NGIT}]`, // Orange
    //   text: "text-orange-600",
    //   border: "border-orange-200",
    //   hover: "hover:from-orange-600 hover:to-orange-500",
    //   glow: "shadow-orange-500/20",
    //   card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    // },
    // kmce: {
    //   primary: `from-[${COLLEGE_COLORS.KMCE}] to-[${COLLEGE_COLORS.KMCE}]`, // Purple
    //   secondary: "from-purple-50 to-purple-100",
    //   accent: `bg-[${COLLEGE_COLORS.KMCE}]`, // Purple
    //   text: "text-purple-600",
    //   border: "border-purple-200",
    //   hover: "hover:from-purple-700 hover:to-purple-600",
    //   glow: "shadow-purple-500/20",
    //   card: "bg-purple-50/70 backdrop-blur-sm border-purple-200/50",
    // },
    // kmec: {
    //   primary: `from-[${COLLEGE_COLORS.KMEC}] to-[${COLLEGE_COLORS.KMEC}]`, // Light Blue
    //   secondary: "from-blue-50 to-blue-100",
    //   accent: `bg-[${COLLEGE_COLORS.KMEC}]`, // Light Blue
    //   text: "text-blue-700",
    //   border: "border-blue-200",
    //   hover: "hover:from-blue-700 hover:to-blue-600",
    //   glow: "shadow-blue-500/20",
    //   card: "bg-blue-50/70 backdrop-blur-sm border-blue-200/50",
    // },
    // "NGIT/KMEC": {
    //   primary: `from-[${COLLEGE_COLORS["NGIT/KMEC"]}] to-[${COLLEGE_COLORS["NGIT/KMEC"]}]`, // Orange
    //   secondary: "from-orange-50 to-orange-100",
    //   accent: `bg-[${COLLEGE_COLORS["NGIT/KMEC"]}]`, // Orange
    //   text: "text-orange-600",
    //   border: "border-orange-200",
    //   hover: "hover:from-orange-600 hover:to-orange-500",
    //   glow: "shadow-orange-500/20",
    //   card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    // },
  };

  const currentTheme =
    COLLEGE_THEMES[college?.toLowerCase()] || COLLEGE_THEMES.default;

  useEffect(() => {
    dispatch(GetCampusAppsUsageData(college));
  }, [college]);

  const { getCampusAppUsageReducerData, getCampusAppUsageReducerDataLoading } =
    useSelector((state) => ({
      getCampusAppUsageReducerData: state.getCampusAppUsageReducerRes.data,
      getCampusAppUsageReducerDataLoading:
        state.getCampusAppUsageReducerRes.loading,
    }));

  const eventNames = [
    "TESSELLATOR",
    "BETAAL",
    "PRASHNAMANCH",
    "TOOFAAN",
    "TANTRIK",
    "TESSERACT",
  ];

  // Modernized range buttons with enhanced styling
  const RANGE_OPTIONS = [
    { key: "1D", label: "1D", days: 1, color: "bg-slate-600" },
    { key: "1W", label: "1W", days: 7, color: "bg-red-500" },
    { key: "1M", label: "1M", days: 30, color: "bg-green-500" },
    { key: "3M", label: "3M", days: 90, color: "bg-blue-500" },
    { key: "6M", label: "6M", days: 180, color: "bg-orange-500" },
    { key: "1Y", label: "1Y", days: 365, color: "bg-red-600" },
  ];

  function flattenData(nested) {
    let arr = [];
    Object.entries(nested).forEach(([monthName, daysObj]) => {
      const monthMap = { may: 5, june: 6 };
      const mNum = monthMap[monthName];
      if (!mNum) return;

      Object.entries(daysObj).forEach(([dayStr, counts]) => {
        const isoDate = `2024-${String(mNum).padStart(2, "0")}-${String(
          dayStr
        ).padStart(2, "0")}`;
        const d = new Date(isoDate);
        arr.push({
          isoDate,
          dateObj: d,
          fullDate: `${String(dayStr).padStart(
            2,
            "0"
          )} ${monthName.toUpperCase()}`,
          ...counts,
        });
      });
    });

    arr.sort((a, b) => a.dateObj - b.dateObj);
    return arr;
  }

  function getRangeData(flat, days, endDate) {
    let result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);

      const isoDate = d.toISOString().slice(0, 10);
      const found = flat.find((x) => x.isoDate === isoDate);

      if (found) {
        result.push(found);
      } else {
        const dayNum = d.getDate().toString().padStart(2, "0");
        const monStr = d
          .toLocaleString("default", { month: "short" })
          .toUpperCase();
        let blankRow = {
          isoDate,
          dateObj: d,
          fullDate: `${dayNum} ${monStr}`,
        };
        eventNames.forEach((ev) => (blankRow[ev] = 0));
        result.push(blankRow);
      }
    }
    return result;
  }

  const [selectedRange, setSelectedRange] = useState("1D");

  const flatData = useMemo(
    () => flattenData(getCampusAppUsageReducerData || {}),
    [getCampusAppUsageReducerData]
  );

  const lastDate =
    flatData.length > 0 ? flatData[flatData.length - 1].dateObj : new Date();

  const dataForRange = useMemo(() => {
    const rangeObj = RANGE_OPTIONS.find((r) => r.key === selectedRange);
    if (!rangeObj) return [];
    return getRangeData(flatData, rangeObj.days, lastDate);
  }, [selectedRange, flatData, lastDate]);

  const getTickInterval = () => {
    if (dataForRange.length <= 8) return 0;
    if (dataForRange.length <= 20) return 1;
    if (dataForRange.length <= 40) return 3;
    return Math.ceil(dataForRange.length / 10);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.secondary} relative overflow-hidden`}
    >
      {/* Modern Glassmorphism Header */}
      <div className="relative z-10">
        {/* Main Content Container */}
        <div className="relative z-10 max-w-8xl mx-auto px-6 py-10">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div
              className={`${currentTheme.card} rounded-3xl border ${currentTheme.border} shadow-2xl ${currentTheme.glow} overflow-hidden backdrop-blur-md`}
            >
              {/* Enhanced Chart Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-100/50">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {displayCollege.toUpperCase()} Campus App Usage
                    </h2>
                    <p className="text-sm text-gray-500">
                      Real-time application analytics
                    </p>
                  </div>
                </div>

                {/* Enhanced Time Range Buttons */}
                <div
                  className={`flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border ${currentTheme.border} shadow-inner`}
                >
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedRange === opt.key
                          ? `${opt.color} text-white shadow-lg hover:shadow-xl`
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                      }`}
                      onClick={() => setSelectedRange(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Chart Container */}
              <div className="p-8 bg-gradient-to-br from-white/50 to-transparent">
                <ResponsiveContainer width="100%" height={480}>
                  <BarChart
                    data={dataForRange}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="#e2e8f0"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="fullDate"
                      interval={getTickInterval()}
                      height={70}
                      angle={-25}
                      textAnchor="end"
                      tickMargin={20}
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        fontSize: "13px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "12px",
                        paddingTop: "20px",
                        fontWeight: 500,
                      }}
                    />
                    {dataForRange.length >= 30 && (
                      <Brush
                        dataKey="fullDate"
                        height={28}
                        stroke="#8884d8"
                        travellerWidth={12}
                        fill="#f3f4f6"
                        // startIndex={Math.max(0, dataForRange.length - 30)}
                        endIndex={dataForRange.length - 1}
                      />
                    )}

                    {eventNames.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="events"
                        fill={APP_COLORS[key] || "#64748b"}
                        radius={[3, 3, 0, 0]}
                        shape={(props) => <CustomBar {...props} />}
                        activeBar={<Rectangle stroke="tomato" />}
                      >
                        <LabelList
                          dataKey={key}
                          position="inside"
                          style={{
                            fill: "white",
                            fontWeight: 700,
                            fontSize: 10,
                            textShadow: "0 1px 4px rgba(0,0,0,0.18)",
                            pointerEvents: "none",
                          }}
                          formatter={(value) => (value > 0 ? value : "")}
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {/* Enhanced Time Range Selector - Mobile */}
            <div
              className={`${currentTheme.card} rounded-2xl border ${currentTheme.border} shadow-xl ${currentTheme.glow} p-6 backdrop-blur-md`}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-2">
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${currentTheme.primary} rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Time Range</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedRange === opt.key
                        ? `${opt.color} text-white shadow-lg`
                        : "bg-white/60 text-gray-700 hover:bg-white/80 border border-gray-200/50 shadow-sm"
                    }`}
                    onClick={() => setSelectedRange(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Chart Container - Mobile */}
            <div
              className={`${currentTheme.card} rounded-2xl border ${currentTheme.border} shadow-xl ${currentTheme.glow} overflow-hidden backdrop-blur-md`}
            >
              <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-white/30 to-transparent">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 bg-gradient-to-br ${currentTheme.primary} rounded-xl flex items-center justify-center`}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                  <span>Campus App Usage</span>
                </h2>
              </div>

              <div className="p-6 bg-gradient-to-br from-white/30 to-transparent">
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart
                    data={dataForRange}
                    margin={{ top: 40, right: 30, left: 30, bottom: 40 }}
                  >
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="#e2e8f0"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="fullDate"
                      interval={getTickInterval()}
                      height={50}
                      angle={-45}
                      textAnchor="end"
                      tickMargin={10}
                      tick={{ fontSize: 9, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "11px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "10px", fontWeight: 500 }}
                    />
                    {eventNames.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="events"
                        fill={APP_COLORS[key] || "#64748b"}
                        radius={[2, 2, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Stats Cards - Mobile Only */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {eventNames.map((app) => {
                const total = dataForRange.reduce(
                  (sum, day) => sum + (day[app] || 0),
                  0
                );
                return (
                  <div
                    key={app}
                    className={`${currentTheme.card} rounded-xl border ${currentTheme.border} shadow-lg ${currentTheme.glow} p-4 text-center backdrop-blur-md transform hover:scale-105 transition-all duration-300`}
                  >
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-3 shadow-sm"
                      style={{ backgroundColor: APP_COLORS[app] || "#64748b" }}
                    ></div>
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 truncate">
                      {app}
                    </h4>
                    <p className="text-lg font-bold text-gray-900">{total}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Tablet Layout */}
          <div className="hidden md:block lg:hidden">
            <div
              className={`${currentTheme.card} rounded-2xl border ${currentTheme.border} shadow-2xl ${currentTheme.glow} overflow-hidden backdrop-blur-md`}
            >
              {/* Header */}
              <div className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-white/30 to-transparent">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${currentTheme.primary} rounded-xl flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                  <span>Campus App Usage</span>
                </h2>

                {/* Enhanced Time Range Buttons - Tablet */}
                <div className="flex flex-wrap gap-3">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedRange === opt.key
                          ? `${opt.color} text-white shadow-lg`
                          : "bg-white/60 text-gray-700 hover:bg-white/80 border border-gray-200/50 shadow-sm"
                      }`}
                      onClick={() => setSelectedRange(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="p-8 bg-gradient-to-br from-white/30 to-transparent">
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={dataForRange}
                    margin={{ top: 15, right: 20, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="#e2e8f0"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="fullDate"
                      interval={getTickInterval()}
                      height={60}
                      angle={-30}
                      textAnchor="end"
                      tickMargin={15}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        fontSize: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        paddingTop: "15px",
                        fontWeight: 500,
                      }}
                    />
                    {eventNames.map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="events"
                        fill={APP_COLORS[key] || "#64748b"}
                        radius={[3, 3, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventUsageChart;
