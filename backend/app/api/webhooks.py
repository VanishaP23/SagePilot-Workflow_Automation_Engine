from fastapi import APIRouter, Request, HTTPException
from ..temporal.client import execute_workflow
from ..database import get_db
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

@router.post("/{workflow_id}")
async def trigger_webhook(workflow_id: str, request: Request):
    try:
        # 1. Capture the full JSON body from the POST request
        try:
            payload = await request.json()
        except:
            payload = {}
            
        execution_id = str(uuid.uuid4())
        
        # 2. Fetch the workflow to get nodes and edges
        db = get_db()
        response = db.table("workflows").select("*").eq("id", workflow_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Workflow not found")
        
        workflow = response.data[0]
        nodes = workflow.get("nodes", [])
        edges = workflow.get("edges", [])
        
        # 3. Pass this data into the Temporal workflow as the starting context
        logger.info(f"Triggering webhook for workflow {workflow_id} with payload: {payload}")
        await execute_workflow(workflow_id, nodes, edges, initial_payload=payload)
        
        return {
            "status": "accepted",
            "execution_id": execution_id,
            "message": "Workflow triggered successfully",
            "received_data": payload
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error triggering webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
