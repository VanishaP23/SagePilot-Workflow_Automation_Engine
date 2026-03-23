"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Execution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  logs: any[];
  result?: any;
  error?: string;
}

interface WorkflowHistoryProps {
  workflowId: string | null;
  onLoad?: (workflowId: string) => void;
}

export function WorkflowHistory({ workflowId, onLoad }: WorkflowHistoryProps) {
  const [history, setHistory] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const url = workflowId 
        ? `${API_URL}/api/history/${workflowId}` 
        : `${API_URL}/api/history`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setHistory(data);
      } else if (data.executions) {
        setHistory(data.executions);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
    setLoading(false);
  }, [workflowId]);
  
  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getDuration = (start: string, end?: string) => {
    if (!end) return 'In progress';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const seconds = Math.round((endTime - startTime) / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      default: return '⏸️';
    }
  };
  
  if (!workflowId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">💾 Save a workflow first</p>
        <p className="text-sm text-gray-400 mt-1">History will appear after you save and run a workflow</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          📜 Workflow History
        </h3>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50"
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>
      
      {loading && history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No execution history yet</p>
          <p className="text-sm text-gray-400 mt-1">Run a workflow to see its history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((execution) => (
            <div
              key={execution.id}
              className={`border rounded-lg overflow-hidden ${
                execution.status === 'completed' 
                  ? 'border-green-200 dark:border-green-800' 
                  : execution.status === 'failed'
                  ? 'border-red-200 dark:border-red-800'
                  : execution.status === 'running'
                  ? 'border-yellow-200 dark:border-yellow-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div
                onClick={() => setExpandedId(expandedId === execution.id ? null : execution.id)}
                className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span>{getStatusIcon(execution.status)}</span>
                    <span className="font-medium text-sm capitalize">
                      {execution.status}
                    </span>
                    {onLoad && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoad(execution.workflow_id);
                        }}
                        className="ml-2 px-2 py-0.5 text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800"
                      >
                        📂 Load Workflow
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(execution.started_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>ID: {execution.id.slice(0, 12)}...</span>
                  <span>Duration: {getDuration(execution.started_at, execution.completed_at)}</span>
                </div>
              </div>
              
              {expandedId === execution.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
                  {/* Error message if failed */}
                  {execution.error && (
                    <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm text-red-700 dark:text-red-300">
                      ❌ {execution.error}
                    </div>
                  )}
                  
                  {/* Execution logs */}
                  {execution.logs && execution.logs.length > 0 && (
                    <>
                      <h4 className="font-medium text-sm mb-2">Execution Logs:</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {execution.logs.map((log: any, index: number) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-xs ${
                              log.status === 'completed' ? 'bg-green-100 dark:bg-green-900/50' :
                              log.status === 'failed' ? 'bg-red-100 dark:bg-red-900/50' :
                              'bg-blue-100 dark:bg-blue-900/50'
                            }`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{log.node_name || log.node_type}</span>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                log.status === 'completed' ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                            {log.error && (
                              <p className="text-red-600 mt-1">❌ {log.error}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Final result */}
                  {execution.result && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-1">Final Result:</h4>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        {JSON.stringify(execution.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
