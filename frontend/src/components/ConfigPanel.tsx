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
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          ⚙️ Configuration
        </h2>
        <p className="text-gray-500 text-sm">
          Select a node to configure it
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateNodeConfig(selectedNode.id, newConfig);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
        ⚙️ {String(selectedNode.data.label)}
      </h2>
      
      {/* Node-specific configuration forms */}
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

        {selectedNode.type === "webhook_trigger" && (
          <div>
            <label className="block text-sm font-medium mb-1">Webhook URL</label>
            <input
              type="text"
              value={config.webhook_url || ""}
              onChange={(e) => handleChange("webhook_url", e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Generated webhook URL"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              This URL will be generated when you save the workflow
            </p>
          </div>
        )}

        {selectedNode.type === "http_request" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                value={config.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="https://api.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                value={config.method || "GET"}
                onChange={(e) => handleChange("method", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            
            {/* Retry Configuration */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                🔄 Retry Configuration
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Retries</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={config.max_retries || 3}
                    onChange={(e) => handleChange("max_retries", parseInt(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of retry attempts (0 to disable)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Retry Delay (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={config.retry_delay || 1}
                    onChange={(e) => handleChange("retry_delay", parseInt(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Initial delay between retries
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Backoff Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={config.backoff_coefficient || 2.0}
                    onChange={(e) => handleChange("backoff_coefficient", parseFloat(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exponential backoff multiplier (e.g., 2.0 = 1s, 2s, 4s, 8s...)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Max Retry Delay (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    value={config.max_retry_delay || 60}
                    onChange={(e) => handleChange("max_retry_delay", parseInt(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum delay between retries
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedNode.type === "transform_data" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Transformation</label>
              <select
                value={config.transformation_type || "to_uppercase"}
                onChange={(e) => handleChange("transformation_type", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="to_uppercase">To Uppercase</option>
                <option value="to_lowercase">To Lowercase</option>
                <option value="append_text">Append Text</option>
                <option value="prepend_text">Prepend Text</option>
                <option value="multiply">Multiply Number</option>
                <option value="divide">Divide Number</option>
                <option value="rename_key">Rename Key</option>
                <option value="extract_key">Extract Key</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Field</label>
              <input
                type="text"
                value={config.target_field || ""}
                onChange={(e) => handleChange("target_field", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="field_name"
              />
            </div>
            {config.transformation_type === 'append_text' && (
              <div>
                <label className="block text-sm font-medium mb-1">Text to Append</label>
                <input
                  type="text"
                  value={config.parameters?.text || ""}
                  onChange={(e) => handleChange("parameters", { ...config.parameters, text: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
            {config.transformation_type === 'prepend_text' && (
              <div>
                <label className="block text-sm font-medium mb-1">Text to Prepend</label>
                <input
                  type="text"
                  value={config.parameters?.text || ""}
                  onChange={(e) => handleChange("parameters", { ...config.parameters, text: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
            {config.transformation_type === 'multiply' && (
              <div>
                <label className="block text-sm font-medium mb-1">Multiply By</label>
                <input
                  type="number"
                  value={config.parameters?.factor || 1}
                  onChange={(e) => handleChange("parameters", { ...config.parameters, factor: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
            {config.transformation_type === 'rename_key' && (
              <div>
                <label className="block text-sm font-medium mb-1">New Key Name</label>
                <input
                  type="text"
                  value={config.parameters?.new_key || ""}
                  onChange={(e) => handleChange("parameters", { ...config.parameters, new_key: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
          </>
        )}

        {selectedNode.type === "decision" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Field</label>
              <input
                type="text"
                value={config.target_field || ""}
                onChange={(e) => handleChange("target_field", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select
                value={config.operator || "equals"}
                onChange={(e) => handleChange("operator", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="greater_than">Greater Than</option>
                <option value="greater_than_or_equal">Greater Than or Equal</option>
                <option value="less_than">Less Than</option>
                <option value="less_than_or_equal">Less Than or Equal</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Not Contains</option>
                <option value="starts_with">Starts With</option>
                <option value="ends_with">Ends With</option>
                <option value="is_empty">Is Empty</option>
                <option value="is_not_empty">Is Not Empty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="text"
                value={config.value || ""}
                onChange={(e) => handleChange("value", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        )}

        {selectedNode.type === "wait" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="number"
                min="1"
                value={config.duration || 30}
                onChange={(e) => handleChange("duration", parseInt(e.target.value))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                value={config.unit || "seconds"}
                onChange={(e) => handleChange("unit", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Execution Logs Section */}
      {executionLogs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-bold mb-2 text-gray-800 dark:text-white">
            📋 Execution Logs
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {executionLogs.map((log: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  log.status === "completed" 
                    ? "bg-green-100 dark:bg-green-900" 
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
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
