import { create } from 'zustand';
import { Node, Edge, addEdge, Connection, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  executionLogs: any[];
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  selectNode: (node: Node | null) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  setExecutionLogs: (logs: any[]) => void;
  clearWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  executionLogs: [],
  
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  
  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },
  
  addNode: (type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: getNodeLabel(type),
        config: getDefaultConfig(type),
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  selectNode: (node) => {
    set({ selectedNode: node });
  },
  
  updateNodeConfig: (nodeId, config) => {
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } };
      }
      return node;
    });
    set({ nodes });
  },
  
  setExecutionLogs: (logs) => set({ executionLogs: logs }),
  
  clearWorkflow: () => set({ nodes: [], edges: [], selectedNode: null, executionLogs: [] }),
}));

function getNodeLabel(type: string): string {
  const labels: Record<string, string> = {
    manual_trigger: "Manual Trigger",
    webhook_trigger: "Webhook Trigger",
    http_request: "HTTP Request",
    transform_data: "Transform Data",
    decision: "Decision",
    wait: "Wait",
    end: "End",
  };
  return labels[type] || type;
}

function getDefaultConfig(type: string): any {
  const configs: Record<string, any> = {
    manual_trigger: { input_payload: { message: "Hello", value: 42 } },
    webhook_trigger: { webhook_url: "" },
    http_request: { url: "", method: "GET", headers: {}, body: {} },
    transform_data: { transformation_type: "to_uppercase", target_field: "message", parameters: {} },
    decision: { target_field: "status", operator: "equals", value: "active" },
    wait: { duration: 30, unit: "seconds" },
    end: { display_output: true },
  };
  return configs[type] || {};
}
