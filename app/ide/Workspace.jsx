import React from "react";
import Split from "react-split";
import ProblemDescription from "./components/ProblemDescription";
import MonacoEditorComponent from "./components/MonacoCodeEditor";
import "../../styles/globals.css";

const Workspace = () => {
    return (
        <Split class="split" minSize={0}>
            <ProblemDescription />
            <MonacoEditorComponent />
        </Split>
    )
}

export default Workspace;