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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ActivitiesByCampusChart = ({ data }) => (
  <Card className="border-orange-200">
    <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
      <CardTitle className="text-orange-800">Activities by Campus</CardTitle>
      <CardDescription className="text-orange-600">Total activities by campus</CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="activities" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] border border-dashed border-red-200 bg-red-50 rounded-md text-red-500 font-medium">
          No data available
        </div>
      )}
    </CardContent>
  </Card>
);

export default ActivitiesByCampusChart;
