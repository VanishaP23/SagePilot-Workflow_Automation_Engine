"use client";

import { useCallback } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { CustomNode } from "./nodes/CustomNode";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  manual_trigger: CustomNode,
  webhook_trigger: CustomNode,
  http_request: CustomNode,
  transform_data: CustomNode,
  decision: CustomNode,
  wait: CustomNode,
  end: CustomNode,
};

export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } = useWorkflowStore();

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleNodeClick = useCallback((_: unknown, node: any) => {
    selectNode(node);
  }, [selectNode]);

  const handleConnect = useCallback((connection: any) => {
    onConnect(connection);
  }, [onConnect]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
          type: "smoothstep",
        }}
        connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
        connectionLineType="smoothstep"
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#e5e7eb" gap={15} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              manual_trigger: "#22c55e",
              webhook_trigger: "#3b82f6",
              http_request: "#a855f7",
              transform_data: "#eab308",
              decision: "#f97316",
              wait: "#06b6d4",
              end: "#ef4444",
            };
            return colors[node.type as string] || "#6b7280";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
