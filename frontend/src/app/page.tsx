"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowCanvas } from "@/components/Canvas";
import { NodePalette } from "@/components/NodePalette";
import { ConfigPanel } from "@/components/ConfigPanel";
import { ExecutionStatus } from "@/components/ExecutionStatus";
import { WorkflowHistory } from "@/components/WorkflowHistory";
import { useWorkflowStore } from "@/store/workflowStore";
import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'execution' | 'history'>('config');
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("My Workflow");
  const [isEditing, setIsEditing] = useState(false);
  const { undo, redo, canUndo, canRedo, nodes, edges, setNodes, setEdges } = useWorkflowStore();
  
  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
  
  const handleRun = async () => {
    const workflowData = useWorkflowStore.getState();
    console.log('Running workflow:', workflowData);
    alert('Workflow execution would start here. Connect to backend API for full functionality.');
  };

  const handleNewWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setWorkflowName("My Workflow");
    alert('New workflow created! Start adding nodes from the left panel.');
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ReactFlowProvider>
        <div className="flex h-screen">
          {/* Left Sidebar - Node Palette */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <NodePalette />
          </div>
          
          {/* Main Canvas */}
          <div className="flex-1 relative">
            <WorkflowCanvas />
            
            {/* Top Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
              {/* Workflow Name */}
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                <span className="text-gray-500">📁</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                    className="bg-transparent border-b-2 border-blue-500 outline-none text-gray-800 dark:text-white font-medium"
                    autoFocus
                  />
                ) : (
                  <span 
                    onClick={() => setIsEditing(true)} 
                    className="text-gray-800 dark:text-white font-medium cursor-pointer hover:text-blue-500"
                  >
                    {workflowName}
                  </span>
                )}
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-10">
              {/* New Workflow Button */}
              <button
                onClick={handleNewWorkflow}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Create New Workflow"
              >
                ➕ New Workflow
              </button>
              {/* Undo/Redo Buttons */}
              <button
                onClick={undo}
                disabled={!canUndo()}
                className={`px-3 py-2 rounded-lg ${
                  canUndo() 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                ↩️ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className={`px-3 py-2 rounded-lg ${
                  canRedo() 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                ↪️ Redo
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button 
                onClick={handleRun}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ▶️ Run
              </button>
            </div>
          </div>
          
          {/* Right Sidebar - Config Panel */}
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('config')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'config'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚙️ Config
              </button>
              <button
                onClick={() => setActiveTab('execution')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'execution'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⏱️ Execution
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📜 History
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'config' && <ConfigPanel />}
              {activeTab === 'execution' && <ExecutionStatus />}
              {activeTab === 'history' && <WorkflowHistory />}
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
