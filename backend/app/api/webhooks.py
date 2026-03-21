from fastapi import APIRouter, Request
from ..temporal.client import execute_workflow
import uuid

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

@router.post("/{workflow_id}")
async def trigger_webhook(workflow_id: str, request: Request):
    try:
        payload = await request.json()
        execution_id = str(uuid.uuid4())
        
        await execute_workflow(workflow_id, payload)
        
        return {
            "status": "accepted",
            "execution_id": execution_id,
            "message": "Workflow triggered successfully"
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }, 500
