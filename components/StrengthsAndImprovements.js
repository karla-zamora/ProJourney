"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrengthsAndImprovements() {
  const strengths = [
    "Problem-solving skills are strong.",
    "Good collaboration with team members.",
    "Effective communication during presentations.",
  ];

  const improvements = [
    "Improve time management skills.",
    "Enhance understanding of complex algorithms.",
    "Work on reducing coding errors.",
  ];
  return (
    <Card className="flex-1 bg-gray-900 border text-white scrollbar-hide overflow-scroll min-h-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">
          Strengths and Areas for Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row p-x-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Strengths</h3>
          <ul className="list-disc pl-5 space-y-1">
            {strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Areas for Improvement
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
