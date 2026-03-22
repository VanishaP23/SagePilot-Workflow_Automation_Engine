"use client";

import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/store/workflowStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ExecutionStatusProps {
  workflowId?: string;
}

export function ExecutionStatus({ workflowId }: ExecutionStatusProps) {
  const { executionLogs, nodes } = useWorkflowStore();
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const startExecution = () => {
    setStatus('running');
    setProgress(0);
    setCurrentNode('manual_trigger');
    
    let nodeIndex = 0;
    const executionInterval = setInterval(() => {
      if (nodeIndex < nodes.length) {
        const currentNodeData = nodes[nodeIndex];
        setCurrentNode(currentNodeData?.id || null);
        setProgress(((nodeIndex + 1) / nodes.length) * 100);
        nodeIndex++;
      } else {
        clearInterval(executionInterval);
        setStatus('completed');
        setProgress(100);
      }
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        ⏱️ Execution Status
      </h3>
      
      <div className={`p-4 rounded-lg ${
        status === 'idle' ? 'bg-gray-100 dark:bg-gray-700' :
        status === 'running' ? 'bg-blue-100 dark:bg-blue-900' :
        status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
        'bg-red-100 dark:bg-red-900'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-3 h-3 rounded-full ${
            status === 'idle' ? 'bg-gray-400' :
            status === 'running' ? 'bg-blue-500' :
            status === 'completed' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span className="font-medium capitalize">{status}</span>
        </div>
        
        {currentNode && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Node: <span className="font-medium">{currentNode}</span>
          </p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2 text-gray-800 dark:text-white">
          📋 Execution Logs
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {executionLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No execution logs yet</p>
          ) : (
            executionLogs.map((log: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  log.status === 'completed' 
                    ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500' 
                    : log.status === 'failed'
                    ? 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500'
                    : 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{log.node_type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    log.status === 'completed' ? 'bg-green-100 text-green-700' :
                    log.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {log.status}
                  </span>
                </div>
                {log.error && (
                  <p className="text-red-600 text-xs mt-1">Error: {log.error}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {status === 'idle' && (
        <button
          onClick={startExecution}
          disabled={nodes.length === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            nodes.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ▶️ Start Execution
        </button>
      )}
      
      {status === 'completed' && (
        <button
          onClick={() => {
            setStatus('idle');
            setProgress(0);
            setCurrentNode(null);
          }}
          className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          🔄 Reset
        </button>
      )}
    </div>
  );
}
