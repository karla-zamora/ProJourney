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

export default function Performance() {
  const performanceData = [
    { subject: "Problem Solving", A: 120, fullMark: 150 },
    { subject: "Coding", A: 99, fullMark: 150 },
    { subject: "Understanding", A: 85, fullMark: 150 },
  ];

  return (
    <Card className="flex-1 bg-gray-900 border text-white overflow-hidden min-h-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">Overall Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={performanceData}>
            <PolarGrid stroke="#444" />
            <PolarAngleAxis dataKey="subject" stroke="#E0E7FF" />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
