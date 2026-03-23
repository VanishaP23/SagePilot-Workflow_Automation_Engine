from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/workflows", tags=["workflows"])


class WorkflowCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: List[dict] = []
    edges: List[dict] = []


@router.get("")
async def list_workflows():
    db = get_db()
    response = db.table("workflows").select("*").execute()
    return response.data


@router.post("")
async def create_workflow(workflow: WorkflowCreateRequest):
    db = get_db()
    workflow_id = str(uuid.uuid4())
    
    data = {
        "id": workflow_id,
        "name": workflow.name,
        "nodes": workflow.nodes,
        "edges": workflow.edges,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    response = db.table("workflows").insert(data).execute()
    
    return {"id": workflow_id, "message": "Workflow created"}


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    db = get_db()
    response = db.table("workflows").select("*").eq("id", workflow_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return response.data[0]


@router.put("/{workflow_id}")
async def update_workflow(workflow_id: str, workflow: WorkflowCreateRequest):
    db = get_db()
    
    data = {
        "name": workflow.name,
        "nodes": workflow.nodes,
        "edges": workflow.edges,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    response = db.table("workflows").update(data).eq("id", workflow_id).execute()
    return {"message": "Workflow updated"}


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str):
    db = get_db()
    db.table("workflows").delete().eq("id", workflow_id).execute()
    return {"message": "Workflow deleted"}


@router.get("/{workflow_id}/export")
async def export_workflow(workflow_id: str):
    db = get_db()
    response = db.table("workflows").select("*").eq("id", workflow_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return response.data[0]
