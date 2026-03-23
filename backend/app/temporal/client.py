import asyncio
import uuid
import logging
from temporalio.client import Client
from temporalio.worker import Worker
from ..config import settings
from .workflows import WorkflowExecutorWorkflow
from .activities import (
    execute_http_request,
    execute_transform,
    execute_decision,
    execute_end
)

logger = logging.getLogger(__name__)

_temporal_client = None

async def get_temporal_client() -> Client:
    global _temporal_client
    if _temporal_client is None:
        _temporal_client = await Client.connect(
            settings.TEMPORAL_HOST,
            namespace=settings.TEMPORAL_NAMESPACE,
            api_key=settings.TEMPORAL_API_KEY,
            tls=True
        )
    return _temporal_client


async def execute_workflow_local(workflow_id: str, nodes: list, edges: list, initial_payload: dict = None):
    """Execute workflow directly in-process without Temporal (fallback mode)."""
    logger.info(f"Executing workflow {workflow_id} in local mode (no Temporal)")
    
    workflow_instance = WorkflowExecutorWorkflow()
    
    # Build the execution context similar to what the workflow does
    adjacency = workflow_instance._build_adjacency(edges)
    start_nodes = workflow_instance._find_start_nodes(nodes)
    execution_order = workflow_instance._topological_sort(nodes, adjacency, start_nodes)
    
    current_payload = initial_payload or {}
    logs = []
    
    from datetime import datetime
    
    for node in execution_order:
        node_type = node.get("type")
        node_config = node.get("data", {}).get("config", {})
        node_name = node.get("data", {}).get("label", node.get("type", "Unknown"))
        
        try:
            if node_type == "manual_trigger":
                current_payload = node_config.get("input_payload", current_payload)
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": current_payload,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
            
            elif node_type == "webhook_trigger":
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": current_payload,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
            
            elif node_type == "http_request":
                result = await execute_http_request(node_config)
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": result,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
                current_payload = result
            
            elif node_type == "transform_data":
                result = await execute_transform(node_config, current_payload)
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": result,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
                current_payload = result
            
            elif node_type == "decision":
                decision_result = await execute_decision(node_config, current_payload)
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": decision_result,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
                branch = "true" if decision_result["condition_met"] else "false"
                adjacency[node["id"]] = [
                    e for e in adjacency.get(node["id"], [])
                    if e.get("sourceHandle") == branch
                ]
            
            elif node_type == "wait":
                duration = node_config.get("duration", 30)
                unit = node_config.get("unit", "seconds")
                if unit == "minutes":
                    duration_seconds = duration * 60
                elif unit == "hours":
                    duration_seconds = duration * 3600
                else:
                    duration_seconds = duration
                
                await asyncio.sleep(min(duration_seconds, 5))  # Cap at 5s for demo
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload,
                    "output": {"message": f"Waited {duration} {unit}"},
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
            
            elif node_type == "end":
                await execute_end(current_payload)
                logs.append({
                    "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                    "status": "completed", "input": current_payload, "output": current_payload,
                    "error": None, "timestamp": datetime.utcnow().isoformat()
                })
        
        except Exception as e:
            logs.append({
                "node_id": node["id"], "node_name": node_name, "node_type": node_type,
                "status": "failed", "input": current_payload, "output": None,
                "error": str(e), "timestamp": datetime.utcnow().isoformat()
            })
            raise
    
    return {"logs": logs, "final_payload": current_payload}


async def execute_workflow(workflow_id: str, nodes: list, edges: list, initial_payload: dict = None):
    """Try Temporal first, fall back to local execution if Temporal is unavailable."""
    try:
        client = await get_temporal_client()
        run_id = f"wf-{workflow_id[:8]}-{uuid.uuid4().hex[:8]}"
        
        result = await client.execute_workflow(
            WorkflowExecutorWorkflow.run,
            [workflow_id, nodes, edges, initial_payload],
            id=run_id,
            task_queue="sage-pilot-tasks"
        )
        return result
    except Exception as e:
        logger.warning(f"Temporal unavailable ({e}), falling back to local execution")
        return await execute_workflow_local(workflow_id, nodes, edges, initial_payload)
