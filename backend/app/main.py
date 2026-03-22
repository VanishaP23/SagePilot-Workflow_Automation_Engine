from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import workflows, execution, webhooks, history
from .config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Workflow Automation Engine - SagePilot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workflows.router)
app.include_router(execution.router)
app.include_router(webhooks.router)
app.include_router(history.router)

@app.get("/")
async def root():
    return {"message": "SagePilot Workflow Engine API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
