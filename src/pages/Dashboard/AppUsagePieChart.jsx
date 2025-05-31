import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const APP_COLORS = [
  "#D97706", // Amber-600
  "#DC2626", // Red-600
  "#EA580C", // Orange-600
  "#B45309", // Amber-700
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
];

const AppUsagePieChart = ({ data }) => (
  <Card className="border-red-200">
    <CardHeader className="bg-gradient-to-r from-red-100 to-orange-100">
      <CardTitle className="text-red-800">App Usage Distribution</CardTitle>
      <CardDescription className="text-red-600">
        Activities by application
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="activities"
              nameKey="app"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
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
          No data available
        </div>
      )}
    </CardContent>
  </Card>
);

export default AppUsagePieChart;
