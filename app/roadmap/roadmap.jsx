import React from "react";
import "./roadmap.css";

function Roadmap() {
  const columnMap = [
    {
      title: "Not Started",
      tickets: [
        {
            problemTitle: "Sup",
            problemTags: ["Arrays", "Strings"],
            problemDifficulty: "Easy",
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
        }
      ],
    },
    {
      title: "Done",
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
    <div className="roadmap">
      {columnMap.map((column, index) => (
        <div className="roadmap-column" key={`${column.title}-${index}`}>
          <div className="roadmap-column-heading">{column.title}</div>
          <div className="roadmap-cards overflow-y-auto">
            {column.tickets.map((ticket, index) => (
              <div key={`${column}-${index}`} className="roadmap-cards-item">
                <div className="roadmap-cards-item-heading">{ticket.title}</div>
                <div className="flex items-center mt-3 space-x-4">
                  <div
                    className={`${difficultyColor(ticket.problemDifficulty)} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                  >
                    {difficulty}
                  </div>
                  {ticket.problemTags.map((tag, index) => (
                    <div key={index} className={`bg-white inline-block rounded-[5px] text-white bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function difficultyColor (difficulty) {
  if (difficulty === "easy") {
    return "bg-olive text-olive";
  } else if (difficulty == "medium") {
    return "bg-dark-yellow text-dark-yellow"
  } else {
    return "bg-dark-pink text-dark-pink"
  }
}

export default Roadmap;
