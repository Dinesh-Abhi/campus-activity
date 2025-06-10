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
import { useDispatch, useSelector } from "react-redux";
import { GetCampusAppsUsageData } from "@/redux/college/actionCreator";
import { APP_COLORS, COLLEGE_COLORS } from "@/components/constants/Color";
import MainConstants from "@/components/constants/MainConstants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// --- Coming Soon Card ---
const ComingSoon = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-80 bg-white rounded-lg shadow-sm border">
    <div className="text-4xl mb-4">🚧</div>
    <div className="text-xl font-semibold">{label} - Coming Soon!</div>
  </div>
);

// --- Tab Config ---
const TABS = [
  { label: "Apps Usage", key: "apps" },
  { label: "Activities Table", key: "activities" },
  { label: "Faculty", key: "faculty" },
  { label: "Reports", key: "reports" },
];

// --- Chart ---
const CustomBar = (props) => {
  const { x, y, width, height, value, fill, onClick } = props;
  return (
    <g onClick={() => onClick && onClick(value)}>
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

  // Theme setup (default only)
  const COLLEGE_THEMES = {
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
  };
  const currentTheme =
    COLLEGE_THEMES[college?.toLowerCase()] || COLLEGE_THEMES.default;

  useEffect(() => {
    dispatch(GetCampusAppsUsageData(college));
  }, [college]);

  const { getCampusAppUsageReducerData } = useSelector((state) => ({
    getCampusAppUsageReducerData: state.getCampusAppUsageReducerRes.data,
  }));

  const eventNames = [
    "TESSELLATOR",
    "BETAAL",
    "PRASHNAMANCH",
    "TOOFAAN",
    "TANTRIK",
    "TESSERACT",
  ];

  const RANGE_OPTIONS = [
    { key: "1D", label: "Today", days: 1, color: "bg-orange-500" },
    { key: "1W", label: "1W", days: 7, color: "bg-orange-500" },
    { key: "1M", label: "1M", days: 30, color: "bg-orange-500" },
    { key: "3M", label: "3M", days: 90, color: "bg-orange-500" },
    { key: "6M", label: "6M", days: 180, color: "bg-orange-500" },
    { key: "1Y", label: "1Y", days: 365, color: "bg-orange-500" },
  ];

  function flattenData(nested) {
    let arr = [];
    Object.entries(nested || {}).forEach(([monthName, daysObj]) => {
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
          fullDate: `${String(dayStr).padStart(2, "0")} ${monthName.toUpperCase()}`,
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
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
        // In flattenData, you already set it, but for blankRow in getRangeData:
        let blankRow = {
          isoDate,
          dateObj: d,
          fullDate: `${dayNum} ${monStr}`,
          month: d.toLocaleString("default", { month: "long" }),
        };

        eventNames.forEach((ev) => (blankRow[ev] = 0));
        result.push(blankRow);
      }
    }
    return result;
  }

  const [selectedRange, setSelectedRange] = useState("1D");
  const [activeTab, setActiveTab] = useState("apps");

  const flatData = useMemo(
    () => flattenData(getCampusAppUsageReducerData),
    [getCampusAppUsageReducerData]
  );

  const lastDate =
    flatData.length > 0 ? flatData[flatData.length - 1].dateObj : new Date();

  const dataForRange = useMemo(() => {
    const rangeObj = RANGE_OPTIONS.find((r) => r.key === selectedRange);
    if (!rangeObj) return [];
    return getRangeData(flatData, rangeObj.days, lastDate);
  }, [selectedRange, flatData, lastDate]);

  const getRangeDescription = (selectedRange) => {
    switch (selectedRange) {
      case "1D":
        return "Today's campus analytics";
      case "1W":
        return "1 week campus analytics";
      case "1M":
        return "1 month campus analytics";
      case "3M":
        return "3 months campus analytics";
      case "6M":
        return "6 months campus analytics";
      case "1Y":
        return "1 year campus analytics";
      default:
        return "Campus analytics";
    }
  };


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#FFFFc0",
            border: ".5px solid darkorange",
            padding: "8px",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          {payload.map((entry) => (
            <p
              key={entry.dataKey}
              style={{
                margin: 0,
                fontWeight: "bold",
                fontSize: "15px",
                color: entry.fill,
              }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  const [visibleData, setVisibleData] = useState(dataForRange);

  useEffect(() => {
    setVisibleData(dataForRange);
  }, [dataForRange]);

  const handleBrushChange = (e) => {
    if (e && typeof e.startIndex === "number" && typeof e.endIndex === "number") {
      setVisibleData(dataForRange.slice(e.startIndex, e.endIndex + 1));
    } else {
      setVisibleData(dataForRange);
    }
  };

  const CustomXAxisTick = ({ x, y, payload, index }) => {
    if (!visibleData || !visibleData[index]) return null;
    const { dateObj, month } = visibleData[index];
    if (!dateObj || !month) return null;

    const day = dateObj.getDate();

    let showAll = visibleData.length <= 45; // show all for ~1.5 months
    let showDays;
    if (visibleData.length > 320) { // ~1 year (change threshold as needed)
      showDays = [1, 15];
    } else if (visibleData.length > 90) { // ~3-6 months
      showDays = [1, 7, 15, 23, 28];
    } else {
      showDays = "all";
    }
    const isTick = showAll || showDays === "all" || showDays.includes(day) || day === 1;

    // Month label logic
    const isMonthStart =
      index === 0 ||
      (visibleData[index].month &&
        visibleData[index - 1] &&
        visibleData[index].month !== visibleData[index - 1].month);

    return (
      <g>
        {isTick && (
          <text
            x={x}
            y={y + 12}
            textAnchor="middle"
            fontSize={12}
            fill="#555"
          >
            {day}
          </text>
        )}
        {isMonthStart && month && (
          <text
            x={x}
            y={y + 28}
            textAnchor="middle"
            fontSize={13}
            fill="#F97316"
            fontWeight="bold"
          >
            {month}
          </text>
        )}
      </g>
    );
  };

  const showLabels = visibleData.length <= 40; // show when zoomed or small range


  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.secondary} relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="relative z-10 max-w-8xl mx-auto px-6 py-10">
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
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

          {/* Tab Content */}
          {activeTab === "apps" && (
            <Card className={`rounded-3xl border ${currentTheme.border} shadow-2xl ${currentTheme.glow} overflow-hidden backdrop-blur-md`}>
              {/* CardHeader: title left, range buttons right */}
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-100/50">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {displayCollege.toUpperCase()} Campus App Usage
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {getRangeDescription(selectedRange)}
                  </CardDescription>

                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-1 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 border border-orange-200 shadow-inner">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${selectedRange === opt.key
                        ? `${opt.color} text-white shadow-lg hover:shadow-xl`
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                        }`}
                      onClick={() => setSelectedRange(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-gradient-to-br from-white/50 to-transparent">
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
                      interval={0}
                      tick={(props) => (
                        <CustomXAxisTick {...props} />
                      )}
                      height={50}
                    />


                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                      axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                      tickLine={{ stroke: "#cbd5e1" }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
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
                        key={selectedRange}
                        dataKey="fullDate"
                        height={28}
                        stroke="#F97316"
                        travellerWidth={12}
                        fill="#FFF4E5"
                        endIndex={dataForRange.length - 1}
                        onChange={handleBrushChange}
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
                        {showLabels && (
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
                        )}
                      </Bar>
                    ))}

                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {activeTab === "activities" && <ComingSoon label="Activities" />}
          {activeTab === "faculty" && <ComingSoon label="Faculty" />}
          {activeTab === "reports" && <ComingSoon label="Reports" />}
        </div>
      </div>
    </div>
  );
};

export default EventUsageChart;
