"use client";

import { useCallback } from "react";
import { ReactFlow, ConnectionLineType, Panel } from "@xyflow/react";
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

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: "#6366f1",
          strokeWidth: 2,
        }}
        fitViewOptions={{ padding: 0.2 }}
      >
        <div className="text-gray-500 text-sm p-4">
          Click nodes from the left panel to add them
        </div>
      </ReactFlow>
    </div>
  );
}
