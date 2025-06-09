import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Sample nested JSON
const nestedData = {
  may: {
    "01": {
      BETAAL: 3,
      PRASHNAMANCH: 0,
      TANTRIK: 0,
      TESSELLATOR: 3,
      TESSERACT: 0,
      TOOFAAN: 3,
    },
    "02": {
      BETAAL: 1,
      PRASHNAMANCH: 0,
      TANTRIK: 0,
      TESSELLATOR: 1,
      TESSERACT: 0,
      TOOFAAN: 1,
    },
  },
  june: {
    "01": {
      BETAAL: 0,
      PRASHNAMANCH: 1,
      TANTRIK: 0,
      TESSELLATOR: 0,
      TESSERACT: 2,
      TOOFAAN: 0,
    },
    "02": {
      BETAAL: 1,
      PRASHNAMANCH: 1,
      TANTRIK: 1,
      TESSELLATOR: 0,
      TESSERACT: 1,
      TOOFAAN: 0,
    },
  },
};

// Format data and capture month change indices
const formatData = (data) => {
  const result = [];
  const monthBoundaries = [];
  let index = 0;

  for (const month in data) {
    monthBoundaries.push({ index, month: month.toUpperCase() });
    for (const day in data[month]) {
      result.push({
        fullDate: `${day.padStart(2, "0")} ${month.toUpperCase()}`,
        day,
        month: month.toUpperCase(),
        ...data[month][day],
      });
      index++;
    }
  }

  return { result, monthBoundaries };
};

const { result: flatData, monthBoundaries } = formatData(nestedData);

const colors = {
  BETAAL: "#8884d8",
  PRASHNAMANCH: "#82ca9d",
  TANTRIK: "#ffc658",
  TESSELLATOR: "#ff7f50",
  TESSERACT: "#a28fd0",
  TOOFAAN: "#ffb347",
};

const EventUsageChart = () => {
  const eventKeys = Object.keys(flatData[0]).filter(
    (key) => !["fullDate", "day", "month"].includes(key)
  );

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 style={{ textAlign: "center" }}>App Usage with Monthly Split</h2>
      <ResponsiveContainer>
        <BarChart
          data={flatData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fullDate"
            interval={0}
            tick={({ x, y, payload, index }) => {
              const curr = flatData[index];
              const prev = index > 0 ? flatData[index - 1] : null;
              const showMonth = !prev || curr.month !== prev.month;

              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    y={10}
                    dy={6}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#000"
                  >
                    {curr.day}
                  </text>
                  {showMonth && (
                    <>
                      <text
                        y={35}
                        dy={6}
                        textAnchor="middle"
                        fontSize={12}
                        fill="black"
                      >
                        {curr.month}
                      </text>
                      <line
                        x1="0"
                        y1={0}
                        x2="0"
                        y2={50}
                        stroke="red"
                        strokeWidth={1}
                      />
                    </>
                  )}
                </g>
              );
            }}
            height={50}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {eventKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[key] || "#ccc"}
            />
          ))}
          <Brush dataKey="fullDate" height={30} stroke="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventUsageChart;
