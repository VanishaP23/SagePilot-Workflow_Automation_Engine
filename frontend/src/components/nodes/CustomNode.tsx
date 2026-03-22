"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

const NODE_COLORS: Record<string, string> = {
  manual_trigger: "bg-green-500",
  webhook_trigger: "bg-blue-500",
  http_request: "bg-purple-500",
  transform_data: "bg-yellow-500",
  decision: "bg-orange-500",
  wait: "bg-cyan-500",
  end: "bg-red-500",
};

const NODE_ICONS: Record<string, string> = {
  manual_trigger: "🖱️",
  webhook_trigger: "🪝",
  http_request: "📡",
  transform_data: "🔄",
  decision: "🤔",
  wait: "⏰",
  end: "🏁",
};

export const CustomNode = memo(({ data, type, selected, id }: NodeProps) => {
  const colorClass = NODE_COLORS[type as string] || "bg-gray-500";
  const icon = NODE_ICONS[type as string] || "📦";
  const isDecision = type === "decision";

  return (
    <div
      className={`
        relative min-w-[150px] px-4 py-3 rounded-lg border-2 shadow-lg
        ${colorClass} text-white
        ${selected ? "border-yellow-400 border-4" : "border-transparent"}
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{String(data.label)}</span>
      </div>

      {/* Input Handle (target) - NOT for triggers or decision (decision uses its own) */}
      {(type !== "manual_trigger" && type !== "webhook_trigger") && (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="!w-4 !h-4 !bg-white !border-2 !border-gray-600 hover:!border-blue-500 transition-colors"
          style={{ top: isDecision ? "30%" : "50%" }}
        />
      )}

      {/* Output Handle (source) for NON-DECISION nodes */}
      {type !== "end" && !isDecision && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-4 !h-4 !bg-white !border-2 !border-gray-600 hover:!border-blue-500 transition-colors"
        />
      )}

      {/* DECISION NODE - True/False Output Handles */}
      {isDecision && (
        <>
          {/* True branch handle */}
          <div className="absolute -right-6 top-1/4 transform -translate-y-1/2">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-xs text-white bg-green-600 px-1.5 py-0.5 rounded font-bold">
              T
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="!w-4 !h-4 !bg-green-400 !border-2 !border-green-600 hover:!bg-green-300 transition-colors"
              style={{ top: "0%" }}
            />
          </div>

          {/* False branch handle */}
          <div className="absolute -right-6 bottom-1/4 transform translate-y-1/2">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-xs text-white bg-red-600 px-1.5 py-0.5 rounded font-bold">
              F
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              className="!w-4 !h-4 !bg-red-400 !border-2 !border-red-600 hover:!bg-red-300 transition-colors"
              style={{ top: "100%" }}
            />
          </div>
        </>
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";
