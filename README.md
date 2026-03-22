# SagePilot Workflow Automation Engine

A powerful visual workflow automation engine inspired by n8n, Temporal, and Zapier. Build, execute, and monitor workflows with an intuitive drag-and-drop interface backed by durable execution capabilities.

![Workflow Builder](https://img.shields.io/badge/Workflow-Builder-blue)
![Temporal](https://img.shields.io/badge/Temporal-Durable%20Execution-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-purple)

## 🚀 Live Demo

- **Frontend:** https://sage-pilot-workflow-automation-engine-4wby1papr.vercel.app
- **Backend API:** https://sagepilot-workflow-automation-engine.onrender.com
- **API Documentation:** https://sagepilot-workflow-automation-engine.onrender.com/docs

---

## ✨ Features

### Core Features
- **Visual Workflow Builder** - Drag-and-drop interface with React Flow
- **7 Node Types** - Manual, Webhook, HTTP Request, Transform, Decision, Wait, End
- **DAG Validation** - Cycle detection using Kahn's Algorithm before execution
- **Real-time Execution** - Monitor workflow execution with live status updates
- **Durable Execution** - Powered by Temporal for fault-tolerant workflows
- **Retry Configuration** - Customizable retry policies for each node

### Bonus Features ✅
- **Undo/Redo** - Full history navigation with Ctrl+Z / Ctrl+Y
- **Execution Status Polling** - Real-time execution monitoring
- **Workflow History** - Complete audit trail stored in Supabase
- **Dark Mode** - Toggle between light and dark themes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SAGEPILOT WORKFLOW ENGINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐               │
│  │   BROWSER    │────►│   FRONTEND   │────►│   BACKEND    │               │
│  │   (User)     │◄────│   (Next.js)  │◄────│   (FastAPI)  │               │
│  └──────────────┘     └──────────────┘     └──────┬───────┘               │
│                                                     │                        │
│                                    ┌────────────────┼────────────────┐       │
│                                    ▼                ▼                ▼       │
│                              ┌──────────┐   ┌────────────┐   ┌──────────┐   │
│                              │  SUPABASE │   │  TEMPORAL  │   │   HTTP   │   │
│                              │    DB     │   │   CLOUD    │   │   APIs   │   │
│                              └──────────┘   └────────────┘   └──────────┘   │
│                                   │                │                          │
└───────────────────────────────────┴────────────────┴──────────────────────────┘
```

---

## 🔄 Execution Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USER      │────►│   FRONTEND   │────►│   API       │────►│   DAG       │
│   Action    │     │   Request    │     │   Receive   │     │   Validate  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                      │
      ┌──────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  TEMPORAL   │────►│   EXECUTE   │────►│   SAVE      │────►│  FRONTEND   │
│  Workflow   │     │   Nodes     │     │   Logs      │     │   Display   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 🧩 Node Types

| Node | Icon | Description | Configuration |
|------|------|-------------|---------------|
| **Manual Trigger** | 🖱️ | Start workflow manually | Input payload (JSON) |
| **Webhook Trigger** | 🪝 | Start workflow via webhook | Auto-generated URL |
| **HTTP Request** | 📡 | Make external API calls | URL, Method, Headers, Body, Retry Settings |
| **Transform Data** | 🔄 | Transform input data | Transformation type, Target field |
| **Decision** | 🤔 | Branch based on condition | Field, Operator, Value (True/False branches) |
| **Wait** | ⏰ | Pause execution (durable) | Duration (seconds/minutes/hours) |
| **End** | 🏁 | Terminate workflow | Final output |

---

## 🔧 Technical Highlights

### DAG Validation (Kahn's Algorithm)
Before any workflow executes, the system validates that the workflow is a valid Directed Acyclic Graph:
- Detects cycles that would cause infinite loops
- Returns 400 error with "Cycle detected in workflow" message
- O(V+E) time complexity

### Durable Wait (workflow.sleep)
The Wait node uses Temporal's `workflow.sleep()`:
- Survives worker restarts
- Timer continues from where it left off
- Does NOT use `time.sleep()` or `asyncio.sleep()`

### Execution Logging
Every node execution is logged with:
- Node ID and name
- Node type
- Status (completed/failed)
- Input and output payload
- Timestamp
- Logs saved to Supabase `executions` table

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React Flow
- **State Management:** Zustand
- **Styling:** Tailwind CSS

### Backend
- **Framework:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Workflow Engine:** Temporal Cloud
- **API Documentation:** Swagger/OpenAPI

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

## 📁 Project Structure

```
SagePilot-Workflow_Automation_Engine/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Main workflow builder
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── globals.css           # Global styles
│   │   ├── components/
│   │   │   ├── Canvas.tsx            # React Flow canvas
│   │   │   ├── NodePalette.tsx      # Node selection panel
│   │   │   ├── ConfigPanel.tsx      # Node configuration
│   │   │   ├── ExecutionStatus.tsx  # Real-time monitoring
│   │   │   ├── WorkflowHistory.tsx   # Past executions
│   │   │   └── nodes/
│   │   │       └── CustomNode.tsx   # Custom node UI
│   │   └── store/
│   │       └── workflowStore.ts      # Zustand with Undo/Redo
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── config.py                # Environment config
│   │   ├── database.py              # Supabase client
│   │   ├── api/
│   │   │   ├── workflows.py         # CRUD endpoints
│   │   │   ├── execution.py         # Run workflow + DAG validation
│   │   │   ├── webhooks.py          # Webhook triggers
│   │   │   └── history.py           # Execution history
│   │   ├── temporal/
│   │   │   ├── client.py            # Temporal client
│   │   │   ├── workflows.py         # Workflow definitions
│   │   │   └── activities.py        # Node activities
│   │   ├── models/
│   │   │   └── workflow.py          # Pydantic models
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── dag_validator.py     # Kahn's algorithm
│   ├── Dockerfile
│   └── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn
- Git

### Clone & Setup
```bash
git clone https://github.com/VanishaP23/SagePilot-Workflow_Automation_Engine.git
cd SagePilot-Workflow_Automation_Engine
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000
```

### Environment Variables
```env
# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TEMPORAL_HOST=your_temporal_host
TEMPORAL_NAMESPACE=your_namespace
TEMPORAL_API_KEY=your_api_key
```

---

## 📡 API Endpoints

### Workflows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflows` | List all workflows |
| POST | `/api/workflows` | Create new workflow |
| GET | `/api/workflows/{id}` | Get workflow by ID |
| PUT | `/api/workflows/{id}` | Update workflow |
| DELETE | `/api/workflows/{id}` | Delete workflow |
| POST | `/api/workflows/{id}/run` | Execute workflow |
| GET | `/api/workflows/{id}/history` | Get execution history |

### Execution Response
```json
{
  "execution_id": "uuid",
  "status": "completed|failed|running",
  "logs": [
    {
      "node_id": "node-123",
      "node_name": "HTTP Request",
      "node_type": "http_request",
      "status": "completed",
      "input": {...},
      "output": {...},
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🎨 Usage Guide

### Creating a Workflow
1. Enter workflow name in the top input box
2. Click nodes from the **Node Palette** to add them
3. **Connect nodes** by dragging from output (right) to input (left)
4. **Click a node** to configure its settings in the right panel
5. Click **💾 Save** to persist to database
6. Click **▶️ Run** to execute

### Node Configuration
- **Manual Trigger:** Edit input payload JSON
- **HTTP Request:** Set URL, method, headers, body, retry settings
- **Transform:** Choose transformation type, set target field
- **Decision:** Set field, operator, and value for branching
- **Wait:** Set duration and unit (seconds/minutes/hours)

### Bonus Features
- **Undo/Redo:** Ctrl+Z / Ctrl+Y
- **Dark Mode:** Click the 🌙/☀️ button
- **History:** Click the 📜 History tab

---

## 🗄️ Database Schema

### workflows
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID primary key |
| name | TEXT | Workflow name |
| nodes | JSONB | Array of node definitions |
| edges | JSONB | Array of edge definitions |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### executions
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID primary key |
| workflow_id | TEXT | Foreign key to workflows |
| status | TEXT | pending/running/completed/failed |
| started_at | TIMESTAMP | Execution start |
| completed_at | TIMESTAMP | Execution end |
| logs | JSONB | Array of execution logs |
| result | JSONB | Final payload |

---

## 🔐 Security

- API keys stored in environment variables (never committed)
- CORS configured for production domains
- Input validation via Pydantic models
- SQL injection prevention via Supabase SDK

---

## 📝 License

This project was created as part of the SagePilot internship application.

---

## 👤 Author

**Vanisha Pathak**
- GitHub: [@VanishaP23](https://github.com/VanishaP23)

---

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - Visual node-based editor
- [Temporal](https://temporal.io/) - Durable workflow execution
- [Supabase](https://supabase.com/) - Database and authentication
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python API framework
- [n8n](https://n8n.io/) - Workflow automation inspiration
- [Zapier](https://zapier.com/) - Automation platform inspiration

---

<p align="center">
  Built with ❤️ for the SagePilot Internship Application
</p>
