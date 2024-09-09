import React from "react";

function Roadmap() {
  const columnMap = [
    {
      title: "Not Started",
      tickets: [
        {
            problemTitle: "Sup",
            problemTags: ["Arrays", "Strings"],
            problemDifficulty: "Easy",
        },
        {
          problemTitle: "Sup",
          problemTags: ["Arrays", "Strings"],
          problemDifficulty: "Medium",
        },
        {
          problemTitle: "Sup",
          problemTags: ["Arrays", "Strings"],
          problemDifficulty: "Medium",
        }
      ],
    },
    {
      title: "In Progress",
      tickets: [
        {
            problemTitle: "Sup",
            problemTags: ["Arrays", "Strings"],
            problemDifficulty: "Medium",
        },
        {
          problemTitle: "Sup",
          problemTags: ["Arrays", "Strings"],
          problemDifficulty: "Medium",
        },
        {
          problemTitle: "Sup",
          problemTags: ["Arrays", "Strings"],
          problemDifficulty: "Medium",
        },
        {
          problemTitle: "Sup",
          problemTags: ["Arrays", "Strings"],
          problemDifficulty: "Medium",
        }
      ],
    },
    {
      title: "Completed",
      tickets: [
        {
            problemTitle: "Sup",
            problemTags: ["Arrays", "Strings"],
            problemDifficulty: "Hard",
        }
      ],
    },
  ];

  return (
    <div class="flex flex-wrap gap-4 p-4">
      <div class="w-full space-y-6">
        {columnMap.map((column, index) => (
          <div class="grid grid-cols-1 gap-6 w-full" key="index">
            <div class="bg-white p-4 rounded-lg shadow-lg" v-for="column in columnMap" key="column.title">
              <h2 class="text-xl font-bold mb-4 text-black">{ column.title }</h2> 
              <div class="max-h-[130px] overflow-y-auto">
                {column.tickets.map((ticket) => (
                  <div class="bg-gray-100 p-4 rounded-lg mb-2 shadow-sm" v-for="ticket in column.tickets" key="index">
                    <h3 class="text-lg font-semibold text-slate-700">{ ticket.problemTitle }</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <div
                        className={`${difficultyColor(ticket.problemDifficulty)} inline-block rounded-full bg-opacity-[.15] px-2.5 py-1 text-sm font-medium capitalize `}
                      >
                        {ticket.problemDifficulty}
                      </div>
                      {ticket.problemTags.map((tag, index) => (
                        <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm" v-for="tag in ticket.problemTags" key="index">{ tag }</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

function difficultyColor (difficulty) {
  if (difficulty.toLowerCase() === "easy") {
    return "bg-olive text-olive";
  } else if (difficulty.toLowerCase() == "medium") {
    return "bg-dark-yellow text-dark-yellow"
  } else {
    return "bg-dark-pink text-dark-pink"
  }
}

export default Roadmap;
