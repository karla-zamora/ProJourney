import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRouter } from "next/router";

const difficultyColors = {
  easy: "bg-olive text-olive",
  medium: "bg-dark-yellow text-dark-yellow",
  hard: " bg-dark-pink text-dark-pink",
};

const ProblemList = ({ problems, onProblemClick }) => {
  // const router = useRouter(); // Initialize the router

  const handleProblemClick = (problem) => {
    // Log the clicked problem
    console.log("Clicked problem basic data:", problem);
    console.log("Clicked problem name:", problem.name);

    // Use the passed onProblemClick function to navigate
    onProblemClick(problem.name);
  };

  return (
    <Card className="w-full bg-gray-900 text-white overflow-hidden">
      <CardHeader className="pl-10 pt-8 pb-2">
        <CardTitle className="text-2xl font-bold">Problem List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          {problems && problems.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {problems.map((problem) => (
                <li
                  key={problem.id}
                  className="px-10 py-6 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleProblemClick(problem)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold mb-4">
                        {problem.name}
                      </h3>
                      <div className="flex items-center flex-wrap gap-3">
                        <Badge
                          className={`${
                            difficultyColors[problem.difficulty.toLowerCase()]
                          } text-white px-4 py-2 text-sm`}
                        >
                          {problem.difficulty}
                        </Badge>
                        {problem.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gray-700 text-gray-200 px-4 py-2 text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      {problem.completed ? (
                        <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
                          Completed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-gray-400 border-gray-400 px-4 py-2 text-sm"
                        >
                          Not Started
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-gray-400 text-lg">
              No problems available for this topic.
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProblemList;
