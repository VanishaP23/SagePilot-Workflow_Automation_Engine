"use client";

import { useCallback } from "react";
import { ReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { CustomNode } from "./nodes/CustomNode";

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

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
        }}
      />
    </div>
  );
}
