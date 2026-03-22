import asyncio
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

_temporal_client = None

async def get_temporal_client() -> Client:
    global _temporal_client
    if _temporal_client is None:
        _temporal_client = await Client.connect(
            settings.TEMPORAL_HOST,
            namespace=settings.TEMPORAL_NAMESPACE,
            api_key=settings.TEMPORAL_API_KEY
        )
    return _temporal_client

async def execute_workflow(workflow_id: str, nodes: list, edges: list, initial_payload: dict = None):
    client = await get_temporal_client()
    
    result = await client.execute_workflow(
        WorkflowExecutorWorkflow.run,
        [workflow_id, nodes, edges, initial_payload],
        id_prefix=f"wf-{workflow_id[:8]}",
        task_queue="sage-pilot-tasks"
    )
    
    return result
