import React from "react";
import Split from "react-split";
import ProblemDescription from "./components/ProblemDescription";
import MonacoEditorComponent from "./components/MonacoCodeEditor";
import "../../styles/globals.css";

const Workspace = ({
    name,
    setName,
    desc,
    setDesc,
    examples,
    setExamples,
    output,
    setOutput,
    difficulty,
    setDifficulty,
    tags,
    setTags,
    constraints,
    setConstraints,
    code,
    setCode,
    testCases,
    handleRunCode,
    passedCases,
    handleTestCases,
    isCodeRunning,
    setIsCodeRunning,
    generateText
}) => {
    return (
        <Split class="split" minSize={0}>
            <ProblemDescription name={name} setName={setName} difficulty={difficulty} setDifficulty={setDifficulty} description={desc} setDescription={setDesc} examples={examples} setExamples={setExamples} constraints={constraints} setConstraints={setConstraints} tags={tags} setTags={setTags} />
            <MonacoEditorComponent
                code={code} setCode={setCode}
                output={output} setOutput={setOutput}
                testCases={testCases}
                handleRunCode={handleRunCode} passedCases={passedCases}
                handleTestCases={handleTestCases}
                isCodeRunning={isCodeRunning}
                setIsCodeRunning={setIsCodeRunning}
                generateText={generateText} />
        </Split>
    )
}

export default Workspace;