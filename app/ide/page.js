"use client"
import {useState} from "react";
import MonacoEditorComponent from "./components/MonacoCodeEditor";
import Workspace from "./Workspace";
import Navbar from "./components/NavBar";

export default function Ide() {
    const [code, setCode] = useState(
        "# Write your code here\n#Framework of thinking (UMPIRE): \n#Umpire\n#Match\n#Plan\n#Implement\n#Review\n#Evaluate\n"
    );

    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
      <div>
        <Navbar />
        <hr className="w-full" />
        <Workspace /> 
      </div>
    )
}