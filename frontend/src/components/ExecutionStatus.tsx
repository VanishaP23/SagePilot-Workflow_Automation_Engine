"use client";

import { useWorkflowStore } from "@/store/workflowStore";

export function ExecutionStatus() {
  const { executionLogs } = useWorkflowStore();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        ⏱️ Execution Status
      </h2>

      {executionLogs.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Click "Run" to execute the workflow. Logs will appear here.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-green-600 text-sm font-medium">
            ✓ Execution completed! ({executionLogs.length} steps)
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {executionLogs.map((log: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  log.status === "completed"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {log.node_name || log.node_type}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      log.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {log.node_type}
                </div>
                {log.error && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Error: {log.error}
                  </div>
                )}
                {log.output && log.status === "completed" && (
                  <div className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
                    <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(log.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
