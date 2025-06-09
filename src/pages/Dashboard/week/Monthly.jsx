// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Brush,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";

// // Sample nested JSON
// const nestedData = {
//   may: {
//     "01": {
//       BETAAL: 3,
//       PRASHNAMANCH: 0,
//       TANTRIK: 0,
//       TESSELLATOR: 3,
//       TESSERACT: 0,
//       TOOFAAN: 3,
//     },
//     "02": {
//       BETAAL: 1,
//       PRASHNAMANCH: 0,
//       TANTRIK: 0,
//       TESSELLATOR: 1,
//       TESSERACT: 0,
//       TOOFAAN: 1,
//     },
//   },
//   june: {
//     "01": {
//       BETAAL: 0,
//       PRASHNAMANCH: 1,
//       TANTRIK: 0,
//       TESSELLATOR: 0,
//       TESSERACT: 2,
//       TOOFAAN: 0,
//     },
//     "02": {
//       BETAAL: 1,
//       PRASHNAMANCH: 1,
//       TANTRIK: 1,
//       TESSELLATOR: 0,
//       TESSERACT: 1,
//       TOOFAAN: 0,
//     },
//   },
// };

// // Format data and capture month change indices
// const formatData = (data) => {
//   const result = [];
//   const monthBoundaries = [];
//   let index = 0;

//   for (const month in data) {
//     monthBoundaries.push({ index, month: month.toUpperCase() });
//     for (const day in data[month]) {
//       result.push({
//         fullDate: `${day.padStart(2, "0")} ${month.toUpperCase()}`,
//         day,
//         month: month.toUpperCase(),
//         ...data[month][day],
//       });
//       index++;
//     }
//   }

//   return { result, monthBoundaries };
// };

// const { result: flatData, monthBoundaries } = formatData(nestedData);

// const colors = {
//   BETAAL: "#8884d8",
//   PRASHNAMANCH: "#82ca9d",
//   TANTRIK: "#ffc658",
//   TESSELLATOR: "#ff7f50",
//   TESSERACT: "#a28fd0",
//   TOOFAAN: "#ffb347",
// };

// const EventUsageChart = () => {
//   const eventKeys = Object.keys(flatData[0]).filter(
//     (key) => !["fullDate", "day", "month"].includes(key)
//   );

//   return (
//     <div style={{ width: "100%", height: 500 }}>
//       <h2 style={{ textAlign: "center" }}>App Usage with Monthly Split</h2>
//       <ResponsiveContainer>
//         <BarChart
//           data={flatData}
//           margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="fullDate"
//             interval={0}
//             tick={({ x, y, payload, index }) => {
//               const curr = flatData[index];
//               const prev = index > 0 ? flatData[index - 1] : null;
//               const showMonth = !prev || curr.month !== prev.month;

//               return (
//                 <g transform={`translate(${x},${y})`}>
//                   <text
//                     y={10}
//                     dy={6}
//                     textAnchor="middle"
//                     fontSize={10}
//                     fill="#000"
//                   >
//                     {curr.day}
//                   </text>
//                   {showMonth && (
//                     <>
//                       <text
//                         y={35}
//                         dy={6}
//                         textAnchor="middle"
//                         fontSize={12}
//                         fill="black"
//                       >
//                         {curr.month}
//                       </text>
//                       <line
//                         x1="0"
//                         y1={0}
//                         x2="0"
//                         y2={50}
//                         stroke="red"
//                         strokeWidth={1}
//                       />
//                     </>
//                   )}
//                 </g>
//               );
//             }}
//             height={50}
//           />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {eventKeys.map((key) => (
//             <Bar
//               key={key}
//               dataKey={key}
//               stackId="a"
//               fill={colors[key] || "#ccc"}
//             />
//           ))}
//           <Brush dataKey="fullDate" height={30} stroke="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default EventUsageChart;

// EventUsageChart.jsx
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// App-specific colors (for tools/apps)
const APP_COLORS = {
  TESSELLATOR: "#e6194b",
  BETAAL: "#3cb44b",
  PRASHNAMANCH: "#ffe119",
  TOOFAAN: "#0082c8",
  TECHTONIC: "#f58231",
  TANTRIK: "#911eb4",
  TESSERACT: "#46f0f0",
};

// This is your REAL JSON data (replace with your actual payload)
const nestedData = {
  may: {
    "01": { BETAAL: 3, PRASHNAMANCH: 0, TANTRIK: 0, TESSELLATOR: 3, TESSERACT: 0, TOOFAAN: 3 },
    "02": { BETAAL: 1, PRASHNAMANCH: 0, TANTRIK: 0, TESSELLATOR: 1, TESSERACT: 0, TOOFAAN: 1 },
    "03": { BETAAL: 1, PRASHNAMANCH: 0, TANTRIK: 5, TESSELLATOR: 8, TESSERACT: 0, TOOFAAN: 1 },
  },
  june: {
    "01": { BETAAL: 0, PRASHNAMANCH: 1, TANTRIK: 0, TESSELLATOR: 0, TESSERACT: 2, TOOFAAN: 0 },
    "02": { BETAAL: 1, PRASHNAMANCH: 1, TANTRIK: 1, TESSELLATOR: 0, TESSERACT: 1, TOOFAAN: 0 },
  },
};

const eventNames = [
  "TESSELLATOR",
  "BETAAL",
  "PRASHNAMANCH",
  "TOOFAAN",
  "TANTRIK",
  "TESSERACT",
];

// Predefined range buttons (1D, 1W, 1M, etc.)
const RANGE_OPTIONS = [
  { key: "1D", label: "1D", days: 1 },
  { key: "1W", label: "1W", days: 7 },
  { key: "1M", label: "1M", days: 30 },
  { key: "3M", label: "3M", days: 90 },
  { key: "6M", label: "6M", days: 180 },
  { key: "1Y", label: "1Y", days: 365 },
];

// Helper to flatten nestedData → an array of:
//   { isoDate, dateObj, fullDate, TESSELLATOR: X, BETAAL: X, ... }
function flattenData(nested) {
  let arr = [];
  Object.entries(nested).forEach(([monthName, daysObj]) => {
    // Map monthName (e.g. "may" or "june") to month number:
    const monthMap = { may: 5, june: 6 };
    const mNum = monthMap[monthName];
    if (!mNum) return;

    Object.entries(daysObj).forEach(([dayStr, counts]) => {
      const isoDate = `2024-${String(mNum).padStart(2, "0")}-${String(dayStr).padStart(2, "0")}`;
      const d = new Date(isoDate);
      arr.push({
        isoDate,
        dateObj: d,
        fullDate: `${String(dayStr).padStart(2, "0")} ${monthName.toUpperCase()}`,
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

const EventUsageChart = () => {
  const [selectedRange, setSelectedRange] = useState("1D");

  const flatData = useMemo(() => flattenData(nestedData), []);
  const lastDate = flatData.length > 0 ? flatData[flatData.length - 1].dateObj : new Date();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              KMIT Apps Usage Analytics
            </h1>
            <p className="text-slate-600 text-lg">
              Real-time monitoring and insights for institutional applications
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-start md:justify-between md:gap-8">
          {/* Chart Container - Desktop */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Application Usage Trends
              </h2>
              <p className="text-slate-600">
                Track daily usage patterns across all KMIT applications
              </p>
            </div>
            
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={dataForRange}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="fullDate"
                  interval={getTickInterval()}
                  height={60}
                  angle={-25}
                  textAnchor="end"
                  tickMargin={20}
                  tick={{ fontSize: 12, fill: "#475569" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "14px" }}
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

          {/* Time Range Selector - Desktop (Right Side) */}
          <div className="w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Time Range
            </h3>
            <div className="space-y-2">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedRange === opt.key
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedRange(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Time Range Selector - Mobile (Top) */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Select Time Range
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedRange === opt.key
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedRange(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container - Mobile */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Usage Trends
              </h2>
              <p className="text-slate-600 text-sm">
                Application usage patterns
              </p>
            </div>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={dataForRange}
                margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="fullDate"
                  interval={getTickInterval()}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                  tickMargin={15}
                  tick={{ fontSize: 10, fill: "#475569" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#475569" }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px" }}
                />
                {eventNames.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="events"
                    fill={APP_COLORS[key] || "#64748b"}
                    radius={[1, 1, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {eventNames.map((app) => {
            const total = dataForRange.reduce((sum, day) => sum + (day[app] || 0), 0);
            return (
              <div key={app} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-center">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: APP_COLORS[app] || "#64748b" }}
                ></div>
                <h4 className="text-xs font-medium text-slate-600 mb-1">{app}</h4>
                <p className="text-lg font-bold text-slate-800">{total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventUsageChart;