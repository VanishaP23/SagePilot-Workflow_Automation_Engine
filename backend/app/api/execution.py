from fastapi import APIRouter, HTTPException
from ..database import get_db
from ..temporal.client import execute_workflow
from ..utils.dag_validator import validate_dag
import uuid

router = APIRouter(prefix="/api/workflows", tags=["execution"])


@router.post("/{workflow_id}/run")
async def run_workflow(workflow_id: str):
    execution_id = str(uuid.uuid4())
    
    db = get_db()
    response = db.table("workflows").select("*").eq("id", workflow_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = response.data[0]
    nodes = workflow.get("nodes", [])
    edges = workflow.get("edges", [])
    
    is_valid, error_msg = validate_dag(nodes, edges)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
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
