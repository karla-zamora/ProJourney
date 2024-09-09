import { BsCheck2Circle } from "react-icons/bs";

const ProblemDescription = ({ name, setName, difficulty, setDifficulty, description, setDescription, examples, setExamples, constraints, setConstraints, tags, setTags }) => {
  const problemDifficulty = difficulty.toLowerCase() === "easy"
      ? "bg-olive text-olive"
      : difficulty.toLowerCase() === "medium"
      ? "bg-dark-yellow text-dark-yellow"
      : "bg-dark-pink text-dark-pink"

  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden overflow-y-hidden">
        <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">{name}</div>
            </div>
            <div className="flex items-center mt-3">
              <div
                className={`${problemDifficulty} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
              >
                {difficulty}
              </div>
              <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                <BsCheck2Circle />
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center mt-3 space-x-4">
              {tags.map((tag, index) => (
                <div key={1} className={`bg-white inline-block rounded-[5px] text-white bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}>
                  {tag}
                </div>
              ))}
            </div>

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <p className="mt-3">{description}</p>
            </div>

            {/* Examples */}
            <div className="mt-4">
              {examples.map((example, index) => (
                <div key={index}>
                  <p className="font-medium text-white">Example {index + 1}:</p>
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input:</strong> {JSON.stringify(example.sampleInput, null, 2)}
                      <br />
                      <strong className="text-white">Output:</strong> {JSON.stringify(example.sampleOutput)}
                      <br />
                      <strong className="text-white">Explanation:</strong> {example.explanation}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="my-5">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                {constraints.map((constraint, index) => (
                  <li key={index} className="mt-2">
                    <code>{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
