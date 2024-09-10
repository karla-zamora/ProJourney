"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DailyAlgorithms({ dailyData }) {
  return (
    <Card className="flex-1 bg-gray-900 border text-white overflow-hidden min-h-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">Daily Algorithms Completed</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-6rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#E0E7FF" />
            <YAxis stroke="#E0E7FF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "none",
              }}
            />
            <Legend />
            <Bar dataKey="algorithms" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
