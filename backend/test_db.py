import sys
import os
sys.path.append(os.getcwd())
import asyncio
from app.api.workflows import create_workflow, WorkflowCreateRequest

async def test():
    req = WorkflowCreateRequest(name="test", description="test", nodes=[], edges=[])
    try:
        res = await create_workflow(req)
        print("SUCCESS:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
