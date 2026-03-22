"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Execution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  logs: any[];
  result?: any;
}

export function WorkflowHistory() {
  const [history, setHistory] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  useEffect(() => {
    const mockHistory: Execution[] = [
      {
        id: 'exec-001',
        workflow_id: 'workflow-1',
        status: 'completed',
        started_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3500000).toISOString(),
        logs: [
          { node_id: '1', node_type: 'manual_trigger', status: 'completed', timestamp: new Date().toISOString() },
          { node_id: '2', node_type: 'transform_data', status: 'completed', timestamp: new Date().toISOString() },
          { node_id: '3', node_type: 'end', status: 'completed', timestamp: new Date().toISOString() },
        ],
        result: { message: 'Hello', transformed: 'HELLO' },
      },
      {
        id: 'exec-002',
        workflow_id: 'workflow-1',
        status: 'failed',
        started_at: new Date(Date.now() - 7200000).toISOString(),
        completed_at: new Date(Date.now() - 7100000).toISOString(),
        logs: [
          { node_id: '1', node_type: 'manual_trigger', status: 'completed', timestamp: new Date().toISOString() },
          { node_id: '2', node_type: 'http_request', status: 'failed', error: 'Connection timeout', timestamp: new Date().toISOString() },
        ],
      },
    ];
    
    setHistory(mockHistory);
  }, []);
  
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
    return `${seconds}s`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          📜 Workflow History
        </h3>
        <button
          onClick={() => setHistory(history)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
        >
          🔄 Refresh
        </button>
      </div>
      
      {history.length === 0 ? (
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
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div
                onClick={() => setExpandedId(expandedId === execution.id ? null : execution.id)}
                className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      execution.status === 'completed' ? 'bg-green-500' :
                      execution.status === 'failed' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    <span className="font-medium text-sm capitalize">
                      {execution.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(execution.started_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>ID: {execution.id.slice(0, 8)}...</span>
                  <span>Duration: {getDuration(execution.started_at, execution.completed_at)}</span>
                </div>
              </div>
              
              {expandedId === execution.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
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
                          <span className="font-medium">{log.node_type}</span>
                          <span className="text-gray-500">{formatDate(log.timestamp)}</span>
                        </div>
                        {log.error && (
                          <p className="text-red-600 mt-1">❌ {log.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
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
