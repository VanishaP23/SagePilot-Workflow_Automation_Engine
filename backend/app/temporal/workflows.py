from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy
from typing import List, Dict, Any
import asyncio

@workflow.defn
class WorkflowExecutorWorkflow:
    def __init__(self):
        self.logs: List[Dict] = []
    
    @workflow.run
    async def run(self, workflow_id: str, nodes: List[Dict], edges: List[Dict], 
                  initial_payload: Dict = None) -> Dict:
        adjacency = self._build_adjacency(edges)
        start_nodes = self._find_start_nodes(nodes)
        execution_order = self._topological_sort(nodes, adjacency, start_nodes)
        
        current_payload = initial_payload or {}
        node_map = {n["id"]: n for n in nodes}
        
        # Import activities inside the method to avoid import issues
        from . import activities
        
        for node in execution_order:
            node_type = node["type"]
            node_config = node.get("configuration", {})
            
            try:
                if node_type == "manual_trigger":
                    current_payload = node_config.get("input_payload", {})
                    self._add_log(node, "completed", current_payload, current_payload)
                
                elif node_type == "webhook_trigger":
                    self._add_log(node, "completed", current_payload, current_payload)
                
                elif node_type == "http_request":
                    result = await workflow.execute_activity(
                        activities.execute_http_request,
                        node_config,
                        start_to_close_timeout=timedelta(seconds=30),
                        retry_policy=RetryPolicy(maximum_attempts=3)
                    )
                    self._add_log(node, "completed", current_payload, result)
                    current_payload = result
                
                elif node_type == "transform_data":
                    result = await workflow.execute_activity(
                        activities.execute_transform,
                        node_config,
                        current_payload
                    )
                    self._add_log(node, "completed", current_payload, result)
                    current_payload = result
                
                elif node_type == "decision":
                    decision_result = await workflow.execute_activity(
                        activities.execute_decision,
                        node_config,
                        current_payload
                    )
                    self._add_log(node, "completed", current_payload, decision_result)
                    branch = "true" if decision_result["condition_met"] else "false"
                    adjacency[node["id"]] = [
                        e for e in adjacency.get(node["id"], []) 
                        if e.get("sourceHandle") == branch
                    ]
                
                elif node_type == "wait":
                    await workflow.execute_activity(
                        activities.execute_wait,
                        node_config,
                        start_to_close_timeout=timedelta(hours=24)
                    )
                    self._add_log(node, "completed", current_payload, {"message": "Wait completed"})
                
                elif node_type == "end":
                    await workflow.execute_activity(
                        activities.execute_end,
                        current_payload
                    )
                    self._add_log(node, "completed", current_payload, current_payload)
            
            except Exception as e:
                self._add_log(node, "failed", current_payload, None, str(e))
                raise
        
        return {"logs": self.logs, "final_payload": current_payload}
    
    def _build_adjacency(self, edges: List[Dict]) -> Dict[str, List[Dict]]:
        adjacency = {}
        for edge in edges:
            source = edge.get("source")
            if source not in adjacency:
                adjacency[source] = []
            adjacency[source].append(edge)
        return adjacency
    
    def _find_start_nodes(self, nodes: List[Dict]) -> List[Dict]:
        return [n for n in nodes if n["type"] in ["manual_trigger", "webhook_trigger"]]
    
    def _topological_sort(self, nodes: List[Dict], adjacency: Dict, start_nodes: List[Dict]) -> List[Dict]:
        node_map = {n["id"]: n for n in nodes}
        visited = set()
        result = []
        
        def dfs(node_id: str):
            if node_id in visited:
                return
            visited.add(node_id)
            
            if node_id in node_map:
                result.append(node_map[node_id])
            
            for edge in adjacency.get(node_id, []):
                dfs(edge.get("target"))
        
        for start in start_nodes:
            dfs(start["id"])
        
        return result
    
    def _add_log(self, node: Dict, status: str, input_data: Any, output_data: Any, error: str = None):
        from datetime import datetime
        self.logs.append({
            "node_id": node["id"],
            "node_type": node["type"],
            "status": status,
            "input": input_data,
            "output": output_data,
            "error": error,
            "timestamp": datetime.utcnow().isoformat()
        })
