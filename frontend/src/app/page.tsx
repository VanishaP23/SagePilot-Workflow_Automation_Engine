"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowCanvas } from "@/components/Canvas";
import { NodePalette } from "@/components/NodePalette";
import { ConfigPanel } from "@/components/ConfigPanel";
import { ExecutionStatus } from "@/components/ExecutionStatus";
import { WorkflowHistory } from "@/components/WorkflowHistory";
import { useWorkflowStore } from "@/store/workflowStore";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'execution' | 'history'>('config');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("My Workflow");
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { undo, redo, canUndo, canRedo, clearWorkflow, nodes, edges, setExecutionLogs, executionLogs } = useWorkflowStore();

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

  // Save workflow to backend
  const handleSave = async () => {
    if (nodes.length === 0) {
      setMessage("Add nodes first!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    setMessage("Saving...");

    try {
      const workflowData = {
        name: workflowName,
        description: "Workflow from UI",
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle
        }))
      };

      if (workflowId) {
        // Update existing
        await fetch(`${API_URL}/api/workflows/${workflowId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workflowData)
        });
        setMessage("Workflow updated!");
      } else {
        // Create new
        const response = await fetch(`${API_URL}/api/workflows`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workflowData)
        });
        const data = await response.json();
        setWorkflowId(data.id);
        setMessage("Workflow saved!");
      }
    } catch (error) {
      setMessage("Save failed! Check backend.");
      console.error(error);
    }

    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Run workflow
  const handleRun = async () => {
    // First save if not saved
    if (!workflowId) {
      setMessage("Saving workflow first...");
      await handleSave();
      if (!workflowId) {
        setMessage("Save failed! Cannot run.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }
    }

    setIsRunning(true);
    setActiveTab('execution');
    setExecutionLogs([]);
    setMessage("Running workflow...");

    try {
      const response = await fetch(`${API_URL}/api/workflows/${workflowId}/run`, {
        method: "POST"
      });
      const result = await response.json();

      if (result.status === 'completed') {
        setMessage("Workflow completed!");
        setExecutionLogs(result.logs || []);
      } else {
        setMessage(`Error: ${result.error || result.status}`);
      }
    } catch (error) {
      setMessage("Run failed! Check backend.");
      console.error(error);
    }

    setIsRunning(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // New workflow
  const handleNewWorkflow = () => {
    clearWorkflow();
    setWorkflowId(null);
    setWorkflowName("My Workflow");
    setMessage("New workflow created!");
    setTimeout(() => setMessage(null), 3000);
  };

  // Load workflow from history
  const { setWorkflowData } = useWorkflowStore();
  const handleLoadWorkflow = async (id: string) => {
    setMessage("Loading workflow...");
    try {
      const response = await fetch(`${API_URL}/api/workflows/${id}`);
      if (!response.ok) throw new Error("Workflow not found");
      
      const data = await response.json();
      setWorkflowId(data.id);
      setWorkflowName(data.name || "Untitled Workflow");
      setWorkflowData(data.nodes || [], data.edges || []);
      
      setActiveTab('config');
      setMessage("Workflow loaded!");
    } catch (error) {
      setMessage("Load failed!");
      console.error(error);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ReactFlowProvider>
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <NodePalette />
          </div>

          {/* Main Canvas */}
          <div className="flex-1 relative">
            <WorkflowCanvas />

            {/* Message Toast */}
            {message && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
                {message}
              </div>
            )}

            {/* Workflow Name Input */}
            <div className="absolute top-4 left-4 z-10">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-gray-800 dark:text-white outline-none focus:border-blue-500 w-48"
                placeholder="Workflow name"
              />
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleNewWorkflow}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ➕ New
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {isSaving ? "💾 Saving..." : "💾 Save"}
              </button>
              <button
                onClick={undo}
                disabled={!canUndo()}
                className={`px-3 py-2 rounded-lg ${
                  canUndo() ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ↩️
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className={`px-3 py-2 rounded-lg ${
                  canRedo() ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ↪️
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? "⏳ Running..." : "▶️ Run"}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('config')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'config' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚙️ Config
              </button>
              <button
                onClick={() => setActiveTab('execution')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'execution' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⏱️ Execution
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📜 History
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'config' && <ConfigPanel />}
              {activeTab === 'execution' && <ExecutionStatus />}
              {activeTab === 'history' && <WorkflowHistory workflowId={workflowId} onLoad={handleLoadWorkflow} />}
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
