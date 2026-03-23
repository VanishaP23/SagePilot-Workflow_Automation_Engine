import { create } from 'zustand';
import { Node, Edge, addEdge, Connection, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  executionLogs: any[];
  
  // History for Undo/Redo
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  selectNode: (node: Node | null) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  setExecutionLogs: (logs: any[]) => void;
  clearWorkflow: () => void;
  
  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Helper to save snapshot before meaningful changes
  _saveSnapshot: () => void;
}

// Check if a node change is meaningful enough for undo history
function isMeaningfulNodeChange(change: NodeChange): boolean {
  // Only track add/remove as meaningful undo-able changes
  // Position changes from dragging happen too frequently
  if (change.type === 'add' || change.type === 'remove') return true;
  return false;
}

function isMeaningfulEdgeChange(change: EdgeChange): boolean {
  if (change.type === 'add' || change.type === 'remove') return true;
  return false;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  executionLogs: [],
  
  // Initialize history
  past: [],
  future: [],
  
  _saveSnapshot: () => {
    const { nodes, edges, past } = get();
    // Limit history to 50 entries to prevent memory issues
    const newPast = [...past, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
    if (newPast.length > 50) newPast.shift();
    set({ past: newPast, future: [] });
  },
  
  onNodesChange: (changes) => {
    const hasMeaningful = changes.some(isMeaningfulNodeChange);
    if (hasMeaningful) {
      get()._saveSnapshot();
    }
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  
  onEdgesChange: (changes) => {
    const hasMeaningful = changes.some(isMeaningfulEdgeChange);
    if (hasMeaningful) {
      get()._saveSnapshot();
    }
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  
  onConnect: (connection) => {
    get()._saveSnapshot();
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },
  
  addNode: (type, position) => {
    get()._saveSnapshot();
    
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
    get()._saveSnapshot();
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        const nodeData = node.data as { label: string; config: any };
        const nodeConfig = nodeData.config as any;
        return { 
          ...node, 
          data: { 
            ...nodeData, 
            config: { ...nodeConfig, ...config } 
          } 
        };
      }
      return node;
    });
    set({ nodes });
  },

  
  setExecutionLogs: (logs) => set({ executionLogs: logs }),
  
  clearWorkflow: () => set({ nodes: [], edges: [], selectedNode: null, executionLogs: [], past: [], future: [] }),
  
  // Undo/Redo implementation
  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    set({
      past: newPast,
      future: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      selectedNode: null,
    });
  },
  
  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    set({
      past: [...past, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      selectedNode: null,
    });
  },
  
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
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
