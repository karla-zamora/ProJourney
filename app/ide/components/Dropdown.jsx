import React from "react";

const Dropdown = ({setLanguage}) => {
    return (
        <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full'>
            <div className='flex items-center text-white'>
                <select 
                    className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                </select>
            </div>
        </div>
    );
};

export default Dropdown;