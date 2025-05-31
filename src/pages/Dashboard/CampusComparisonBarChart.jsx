import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const COLORS = ["#d97706", "#dc2626", "#ea580c", "#fbbf24", "#84cc16"];

const CampusComparisonBarChart = ({ data, campusKeys }) => (
  <Card className="border-amber-200">
    <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
      <CardTitle className="text-amber-800">Campus Comparison by App</CardTitle>
      <CardDescription className="text-amber-600">
        Compare app usage across all campuses
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
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
            <YAxis
              stroke="#d97706"
              allowDecimals={false} // <-- disable decimal ticks
              tickCount={5} // (optional) suggest ~5 ticks
              domain={[0, "dataMax"]} // ensure it starts at 0
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "8px",
              }}
            />
            {campusKeys.map((campusKey, idx) => (
              <Bar
                key={campusKey}
                dataKey={campusKey}
                fill={COLORS[idx % COLORS.length]}
                name={campusKey}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[400px] border border-dashed border-amber-300 bg-amber-50 rounded-md text-amber-600 font-medium">
          No data available
        </div>
      )}
    </CardContent>
  </Card>
);

export default CampusComparisonBarChart;
