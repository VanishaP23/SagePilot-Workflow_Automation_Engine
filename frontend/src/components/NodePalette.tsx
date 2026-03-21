"use client";

import { useWorkflowStore } from "@/store/workflowStore";

const NODE_TYPES = [
  { type: "manual_trigger", label: "Manual Trigger", icon: "🖱️", color: "bg-green-500" },
  { type: "webhook_trigger", label: "Webhook Trigger", icon: "🪝", color: "bg-blue-500" },
  { type: "http_request", label: "HTTP Request", icon: "📡", color: "bg-purple-500" },
  { type: "transform_data", label: "Transform Data", icon: "🔄", color: "bg-yellow-500" },
  { type: "decision", label: "Decision", icon: "🤔", color: "bg-orange-500" },
  { type: "wait", label: "Wait", icon: "⏰", color: "bg-cyan-500" },
  { type: "end", label: "End", icon: "🏁", color: "bg-red-500" },
];

export function NodePalette() {
  const { addNode } = useWorkflowStore();

  const handleClick = (nodeType: string) => {
    const x = 250 + Math.random() * 200;
    const y = 200 + Math.random() * 200;
    addNode(nodeType, { x, y });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">📦 Node Palette</h2>
      <p className="text-sm text-gray-500 mb-4">Click to add nodes</p>
      
      <div className="space-y-2">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            onClick={() => handleClick(node.type)}
            className={`${node.color} text-white px-4 py-3 rounded-lg cursor-pointer hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-2`}
          >
            <span className="text-lg">{node.icon}</span>
            <span className="font-medium">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
