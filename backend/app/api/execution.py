from fastapi import APIRouter, HTTPException
from ..database import get_db
from ..temporal.client import execute_workflow
from ..utils.dag_validator import validate_dag
import uuid
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/workflows", tags=["execution"])


@router.post("/{workflow_id}/run")
async def run_workflow(workflow_id: str):
    logger.info(f"Starting workflow execution for workflow_id: {workflow_id}")
    
    try:
        db = get_db()
        logger.info("Database connection established")
    except Exception as db_err:
        logger.error(f"Database connection failed: {db_err}")
        return {
            "execution_id": None,
            "status": "failed",
            "error": f"Database connection failed: {str(db_err)}"
        }
    
    try:
        response = db.table("workflows").select("*").eq("id", workflow_id).execute()
        logger.info(f"Fetched workflow: {response.data}")
    except Exception as fetch_err:
        logger.error(f"Failed to fetch workflow: {fetch_err}")
        return {
            "execution_id": None,
            "status": "failed",
            "error": f"Failed to fetch workflow: {str(fetch_err)}"
        }
    
    if not response.data:
        logger.warning(f"Workflow not found: {workflow_id}")
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = response.data[0]
    nodes = workflow.get("nodes", [])
    edges = workflow.get("edges", [])
    
    logger.info(f"Validating DAG - nodes: {len(nodes)}, edges: {len(edges)}")
    is_valid, error_msg = validate_dag(nodes, edges)
    if not is_valid:
        logger.warning(f"DAG validation failed: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    execution_id = str(uuid.uuid4())
    logger.info(f"Created execution_id: {execution_id}")
    
    try:
        db.table("executions").insert({
            "id": execution_id,
            "workflow_id": workflow_id,
            "status": "running",
            "started_at": datetime.utcnow().isoformat(),
            "logs": [],
            "result": None
        }).execute()
        logger.info("Execution record created in database")
    except Exception as insert_err:
        logger.error(f"Failed to create execution record: {insert_err}")
        return {
            "execution_id": execution_id,
            "status": "failed",
            "error": f"Failed to create execution record: {str(insert_err)}"
        }
    
    try:
        logger.info("Starting Temporal workflow execution")
        result = await execute_workflow(workflow_id, nodes, edges)
        logger.info(f"Temporal workflow completed: {result}")
        
        db.table("executions").update({
            "status": "completed",
            "completed_at": datetime.utcnow().isoformat(),
            "logs": result.get("logs", []),
            "result": result.get("final_payload")
        }).eq("id", execution_id).execute()
        
        return {
            "execution_id": execution_id,
            "status": "completed",
            "logs": result.get("logs", [])
        }
    except Exception as e:
        logger.error(f"Temporal workflow failed: {e}")
        try:
            db.table("executions").update({
                "status": "failed",
                "completed_at": datetime.utcnow().isoformat(),
                "error": str(e)
            }).eq("id", execution_id).execute()
        except:
            pass
        
        return {
            "execution_id": execution_id,
            "status": "failed",
            "error": str(e)
        }


@router.get("/{workflow_id}/logs")
async def get_execution_logs(workflow_id: str):
    return {"logs": [], "message": "Logs endpoint"}
