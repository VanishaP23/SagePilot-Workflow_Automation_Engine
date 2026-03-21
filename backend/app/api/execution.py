from fastapi import APIRouter
from ..temporal.client import execute_workflow
import uuid

router = APIRouter(prefix="/api/workflows", tags=["execution"])

@router.post("/{workflow_id}/run")
async def run_workflow(workflow_id: str):
    execution_id = str(uuid.uuid4())
    
    try:
        result = await execute_workflow(workflow_id)
        return {
            "execution_id": execution_id,
            "status": "completed",
            "logs": result.get("logs", [])
        }
    except Exception as e:
        return {
            "execution_id": execution_id,
            "status": "failed",
            "error": str(e),
            "logs": []
        }

@router.get("/{workflow_id}/logs")
async def get_execution_logs(workflow_id: str):
    return {"logs": [], "message": "Logs endpoint"}
