from fastapi import APIRouter, HTTPException
from ..database import get_db
from datetime import datetime

router = APIRouter(prefix="/api/workflows", tags=["history"])

@router.get("/{workflow_id}/history")
async def get_workflow_history(workflow_id: str):
    """Get execution history for a workflow"""
    db = get_db()
    
    try:
        response = db.table("executions").select("*").eq("workflow_id", workflow_id).order("started_at", desc=True).execute()
        return response.data
    except Exception as e:
        return {"error": str(e), "executions": []}

@router.post("/{workflow_id}/history")
async def create_execution(workflow_id: str):
    """Create a new execution record"""
    db = get_db()
    
    execution_id = f"exec-{workflow_id[:8]}-{int(datetime.utcnow().timestamp())}"
    
    data = {
        "id": execution_id,
        "workflow_id": workflow_id,
        "status": "pending",
        "started_at": datetime.utcnow().isoformat(),
        "logs": [],
        "result": None
    }
    
    try:
        response = db.table("executions").insert(data).execute()
        return {"id": execution_id, "message": "Execution created"}
    except Exception as e:
        return {"error": str(e)}

@router.put("/{workflow_id}/history/{execution_id}")
async def update_execution(workflow_id: str, execution_id: str, status: str, logs: list = None, result: dict = None):
    """Update execution status"""
    db = get_db()
    
    data = {
        "status": status,
        "completed_at": datetime.utcnow().isoformat() if status in ["completed", "failed"] else None
    }
    
    if logs is not None:
        data["logs"] = logs
    
    if result is not None:
        data["result"] = result
    
    try:
        response = db.table("executions").update(data).eq("id", execution_id).execute()
        return {"message": "Execution updated"}
    except Exception as e:
        return {"error": str(e)}
