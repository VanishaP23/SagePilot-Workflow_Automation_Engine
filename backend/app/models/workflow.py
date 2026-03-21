from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None

class NodePosition(BaseModel):
    x: float
    y: float

class NodeConfig(BaseModel):
    type: str
    configuration: Dict[str, Any]
    position: NodePosition

class EdgeConfig(BaseModel):
    source: str
    target: str
    sourceHandle: Optional[str] = "default"

class WorkflowSaveRequest(BaseModel):
    name: str
    nodes: List[NodeConfig]
    edges: List[EdgeConfig]

class WorkflowResponse(BaseModel):
    id: str
    name: str
    nodes: List[NodeConfig]
    edges: List[EdgeConfig]
    created_at: str
    updated_at: str
