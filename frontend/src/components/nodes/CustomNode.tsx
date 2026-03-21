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

export const CustomNode = memo(({ data, type, selected }: NodeProps) => {
  const colorClass = NODE_COLORS[type as string] || "bg-gray-500";
  const icon = NODE_ICONS[type as string] || "📦";

  return (
    <div
      className={`
        min-w-[150px] px-4 py-3 rounded-lg border-2 shadow-lg
        ${colorClass} text-white
        ${selected ? "border-yellow-400 border-4" : "border-transparent"}
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{data.label}</span>
      </div>
      
      {type !== "manual_trigger" && type !== "webhook_trigger" && (
        <Handle type="target" position={Position.Left} className="w-4 h-4 bg-white border-2 border-gray-400" />
      )}
      
      {type !== "end" && (
        <Handle type="source" position={Position.Right} id="default" className="w-4 h-4 bg-white border-2 border-gray-400" />
      )}
      
      {type === "decision" && (
        <>
          <div className="absolute -right-8 top-0 text-xs text-white bg-green-600 px-1 rounded">T</div>
          <Handle type="source" position={Position.Right} id="true" style={{ top: "30%" }} className="w-4 h-4 bg-green-400 border-2 border-white" />
          <div className="absolute -right-8 bottom-0 text-xs text-white bg-red-600 px-1 rounded">F</div>
          <Handle type="source" position={Position.Right} id="false" style={{ top: "70%" }} className="w-4 h-4 bg-red-400 border-2 border-white" />
        </>
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";
