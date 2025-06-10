import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceDot,
  Rectangle,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { COLLEGE_COLORS } from "@/components/constants/Color";
import MainConstants from "@/components/constants/MainConstants";

const { APPORDER } = MainConstants;

const CustomBar = (props) => {
  const { x, y, width, height, value, fill, onClick } = props;
  return (
    <g onClick={() => onClick(value)}>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {value === 0 && <circle cx={x + width / 2} cy={y - 5} r={4} fill="red" />}
    </g>
  );
};

const ConditionalLabel = ({ x, y, width, value }) => {
  if (value === 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#000"
      fontSize={12}
      textAnchor="middle"
    >
      {value}
    </text>
  );
};

const LabelInsideStacked = ({ x, y, width, height, value }) => {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2 + 5}
      fill="#fff"
      fontSize={12}
      textAnchor="middle"
      pointerEvents="none"
    >
      {value}
    </text>
  );
};

const AppCampusComparisonBarChart = ({
  data = [],
  campusKeys,
  datePresets = [],
  selectedRange = "today",
  onRangeChange = () => { },
  chartType = "stacked",
}) => {
  const [activeKeys, setActiveKeys] = React.useState(campusKeys);

  const orderedData =
    chartType === "grouped"
      ? APPORDER.map((appName) => {
        const found = data.find((row) => row.app === appName);
        if (found) {
          return { ...found };
        } else {
          return {
            app: appName,
            ...Object.fromEntries(campusKeys.map((ck) => [ck, 0])),
          };
        }
      })
      : [];

  const groupedWithTotals = orderedData.map((entry) => {
    const total = campusKeys.reduce((sum, k) => sum + (entry[k] || 0), 0);
    return { ...entry, total };
  });
  const stackedWithTotals = data.map((entry) => {
    const total = campusKeys.reduce((sum, k) => sum + (entry[k] || 0), 0);
    return { ...entry, total };
  });

  const chartData =
    chartType === "grouped" ? groupedWithTotals : stackedWithTotals;

  const handleLegendClick = (payload) => {
    const clickedKey = payload.value;
    if (activeKeys.length === 1 && activeKeys[0] === clickedKey) {
      // If only that campus was active, reset to show all again
      setActiveKeys(campusKeys);
    } else {
      // Otherwise, show just the clicked campus
      setActiveKeys([clickedKey]);
    }
  };

  const hasDataForActiveKeys = activeKeys.some((key) =>
    chartData.some((entry) => entry[key] > 0)
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#FFFFc0", // very light yellow
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
  return (
    <Card className="border-amber-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              Usage
            </CardTitle>
            <CardDescription className="text-amber-600 text-sm">
              Compare app usage across campuses
            </CardDescription>
          </div>

          {/* Date‐preset buttons aligned to the right */}
          {/* <div className="flex space-x-2">
            {datePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onRangeChange(preset.value)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${
                    selectedRange === preset.value
                      ? "bg-amber-600 text-white shadow-md transform scale-105"
                      : "bg-white/70 text-amber-700 hover:bg-white hover:shadow-sm border border-amber-300"
                  }
                `}
              >
                {preset.label}
              </button>
            ))}
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Button Row */}
        <div className="flex justify-end px-2 sm:px-4 md:px-6 pb-2 pt-4">
          <div className="flex flex-wrap gap-2">
            {datePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onRangeChange(preset.value)}
                className={`
            px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200
            ${selectedRange === preset.value
                    ? "bg-amber-600 text-white shadow-md scale-105"
                    : "bg-white/70 text-amber-700 hover:bg-white hover:shadow-sm border border-amber-300"
                  }
          `}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        {chartData && chartData.length > 0 ? (
          <div className="px-2 sm:px-4 md:px-6 pb-4 pt-0">
            <div className="w-full h-[260px] xs:h-[320px] sm:h-[360px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 24, right: 12, left: 6, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={chartType === "grouped" ? "app" : "day"}
                    stroke="#666"
                    tick={{ fontSize: 12, fill: "#666" }}
                    label={{
                      value: chartType === "grouped" ? "Apps" : "Day",
                      position: "insideBottom",
                      offset: -10,
                      fill: "#666",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#666" }}
                    label={{
                      value: "Sessions",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fill: "#666",
                      fontSize: 11,
                    }}
                    stroke="#666"
                    allowDecimals={false}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      lineHeight: "24px",
                      fontSize: "14px",
                    }}
                    onClick={handleLegendClick}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {activeKeys.map((campusKey) => {
                    const isLastActive =
                      chartType === "stacked" &&
                      campusKey === activeKeys[activeKeys.length - 1];
                    return (
                      <Bar
                        key={campusKey}
                        dataKey={campusKey}
                        fill={COLLEGE_COLORS[campusKey]}
                        name={campusKey}
                        stackId={chartType === "stacked" ? "a" : undefined}
                        shape={(props) => <CustomBar {...props} />}
                        activeBar={<Rectangle stroke="tomato" />}
                      >
                        {chartType === "grouped" && (
                          <LabelList dataKey={campusKey} content={<ConditionalLabel />} />
                        )}
                        {chartType === "stacked" && (
                          <LabelList dataKey={campusKey} content={<LabelInsideStacked />} />
                        )}
                        {isLastActive && (
                          <LabelList
                            content={({ x, y, width, value }) => {
                              if (value !== 0) return null;
                              return (
                                <circle
                                  cx={x + width / 2}
                                  cy={y - 5}
                                  r={4}
                                  fill="red"
                                />
                              );
                            }}
                          />
                        )}
                      </Bar>
                    );
                  })}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] xs:h-[260px] sm:h-[300px] md:h-[400px] border border-dashed border-amber-300 bg-amber-50 rounded-lg">
            <div className="text-center px-4">
              <div className="text-amber-600 font-medium mb-2">
                No data available
              </div>
              <div className="text-amber-500 text-sm">
                Try selecting a different time range
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Card>
  );
};

export default AppCampusComparisonBarChart;
