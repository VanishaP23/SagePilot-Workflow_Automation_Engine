"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowCanvas } from "@/components/Canvas";
import { NodePalette } from "@/components/NodePalette";
import { ConfigPanel } from "@/components/ConfigPanel";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ReactFlowProvider>
        <div className="flex h-screen">
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <NodePalette />
          </div>
          
          <div className="flex-1 relative">
            <WorkflowCanvas />
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg">
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">▶️ Run</button>
            </div>
          </div>
          
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <ConfigPanel />
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
