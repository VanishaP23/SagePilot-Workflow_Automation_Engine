"use client";

import { useWorkflowStore } from "@/store/workflowStore";
import { useState, useEffect } from "react";

export function ConfigPanel() {
  const { selectedNode, updateNodeConfig, executionLogs } = useWorkflowStore();
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">⚙️ Configuration</h2>
        <p className="text-gray-500 text-sm">Select a node to configure it</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateNodeConfig(selectedNode.id, newConfig);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">⚙️ {String(selectedNode.data.label)}</h2>

      
      <div className="space-y-4">
        {selectedNode.type === "manual_trigger" && (
          <div>
            <label className="block text-sm font-medium mb-1">Input Payload (JSON)</label>
            <textarea
              value={JSON.stringify(config.input_payload || {}, null, 2)}
              onChange={(e) => {
                try { handleChange("input_payload", JSON.parse(e.target.value)); } catch {}
              }}
              className="w-full h-32 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        )}

        {selectedNode.type === "http_request" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input type="text" value={config.url || ""} onChange={(e) => handleChange("url", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="https://api.example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Method</label>
              <select value={config.method || "GET"} onChange={(e) => handleChange("method", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </>
        )}

        {selectedNode.type === "transform_data" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Transformation</label>
              <select value={config.transformation_type || "to_uppercase"} onChange={(e) => handleChange("transformation_type", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="to_uppercase">To Uppercase</option>
                <option value="append_text">Append Text</option>
                <option value="prepend_text">Prepend Text</option>
                <option value="multiply">Multiply Number</option>
                <option value="rename_key">Rename Key</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Field</label>
              <input type="text" value={config.target_field || ""} onChange={(e) => handleChange("target_field", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </>
        )}

        {selectedNode.type === "decision" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Field</label>
              <input type="text" value={config.target_field || ""} onChange={(e) => handleChange("target_field", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select value={config.operator || "equals"} onChange={(e) => handleChange("operator", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
                <option value="contains">Contains</option>
                <option value="is_empty">Is Empty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input type="text" value={config.value || ""} onChange={(e) => handleChange("value", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </>
        )}

        {selectedNode.type === "wait" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input type="number" value={config.duration || 30} onChange={(e) => handleChange("duration", parseInt(e.target.value))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select value={config.unit || "seconds"} onChange={(e) => handleChange("unit", e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </>
        )}
      </div>

      {executionLogs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-bold mb-2 text-gray-800 dark:text-white">📋 Execution Logs</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {executionLogs.map((log, index) => (
              <div key={index} className={`p-2 rounded text-sm ${log.status === "completed" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>
                <div className="font-medium">{log.node_type}</div>
                <div className="text-xs opacity-75">{log.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
