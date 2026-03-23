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
- **7 Node Types** - Manual Trigger, Webhook Trigger, HTTP Request, Transform, Decision, Wait, End
- **DAG Validation** - Cycle detection using Kahn's Algorithm before execution
- **Real-time Execution** - Monitor workflow execution with live status updates
- **Durable Execution** - Powered by Temporal for fault-tolerant workflows
- **Retry Configuration** - Customizable retry policies for each HTTP Request node

### Bonus Features ✅
- **Undo/Redo** - Full history navigation with Ctrl+Z / Ctrl+Y
- **Execution Status** - Real-time execution monitoring in dedicated tab
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
│                              │ SUPABASE │   │  TEMPORAL  │   │   HTTP   │   │
│                              │    DB    │   │   CLOUD    │   │   APIs   │   │
│                              └──────────┘   └────────────┘   └──────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Execution Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USER      │────►│   FRONTEND   │────►│   API       │────►│   DAG       │
│   Clicks    │     │   Save/Run   │     │   Receive   │     │   Validate  │
│   Run       │     │   Request    │     │             │     │   Graph     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                      │
                          ┌────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  TEMPORAL   │────►│   EXECUTE   │────►│   SAVE      │────►│  FRONTEND   │
│  Workflow   │     │   Nodes     │     │   Logs      │     │   Display   │
│  Engine     │     │  Sequentially│    │   to DB     │     │   Results   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 🧩 Node Types

| Node | Icon | Description | Configuration |
|------|------|-------------|---------------|
| **Manual Trigger** | 🖱️ | Start workflow manually | Input payload (JSON) |
| **Webhook Trigger** | 🪝 | Start workflow via HTTP webhook | Auto-generated webhook URL |
| **HTTP Request** | 📡 | Make external API calls | URL, Method, Headers, Body, Retry Settings |
| **Transform Data** | 🔄 | Transform input data | Transformation type, Target field |
| **Decision** | 🤔 | Branch based on condition | Field, Operator, Value (True/False branches) |
| **Wait** | ⏰ | Pause execution (durable) | Duration (seconds/minutes/hours) |
| **End** | 🏁 | Terminate workflow | Final output message |

### Decision Node Branches
The Decision node creates two execution paths:
- 🟢 **True Branch** - Executed when condition evaluates to true
- 🔴 **False Branch** - Executed when condition evaluates to false

---

## 🔧 Technical Highlights

### 1. DAG Validation (Kahn's Algorithm)
Before any workflow executes, the system validates that the workflow is a valid Directed Acyclic Graph:
- Detects cycles that would cause infinite loops
- Returns 400 error with "Cycle detected in workflow" message
- O(V+E) time complexity

```python
# Location: backend/app/utils/dag_validator.py
def validate_dag(nodes: list, edges: list) -> tuple[bool, str]:
    # Kahn's algorithm implementation
```

### 2. Durable Wait (workflow.sleep)
The Wait node uses Temporal's `workflow.sleep()`:
- Survives worker restarts
- Timer continues from where it left off
- Does NOT use `time.sleep()` or `asyncio.sleep()`

```python
# Location: backend/app/temporal/workflows.py
await workflow.sleep(duration_seconds)  # Durable pause
```

### 3. Execution Logging
Every node execution is logged with detailed information:
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
│   │   │   ├── NodePalette.tsx       # Node selection panel
│   │   │   ├── ConfigPanel.tsx       # Node configuration
│   │   │   ├── ExecutionStatus.tsx   # Real-time monitoring
│   │   │   ├── WorkflowHistory.tsx    # Past executions
│   │   │   └── nodes/
│   │   │       └── CustomNode.tsx    # Custom node UI with handles
│   │   └── store/
│   │       └── workflowStore.ts       # Zustand with Undo/Redo
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── config.py                 # Environment config
│   │   ├── database.py               # Supabase client
│   │   ├── api/
│   │   │   ├── workflows.py          # CRUD endpoints
│   │   │   ├── execution.py          # Run workflow + DAG validation
│   │   │   ├── webhooks.py           # Webhook triggers
│   │   │   └── history.py            # Execution history
│   │   ├── temporal/
│   │   │   ├── client.py             # Temporal client
│   │   │   ├── workflows.py          # Workflow definitions
│   │   │   └── activities.py        # Node activities
│   │   ├── models/
│   │   │   └── workflow.py           # Pydantic models
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── dag_validator.py      # Kahn's algorithm
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

### Clone the Repository
```bash
git clone https://github.com/VanishaP23/SagePilot-Workflow_Automation_Engine.git
cd SagePilot-Workflow_Automation_Engine
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000
```

### Environment Variables
Create a `backend/.env` file:
```env
SUPABASE_URL=https://wglojqkqycsibloronjx.supabase.co
SUPABASE_KEY=your_supabase_key
TEMPORAL_HOST=quickstart-pathakvan-4da80dcc.pj6yk.tmprl.cloud:7233
TEMPORAL_NAMESPACE=quickstart-pathakvan-4da80dcc
TEMPORAL_API_KEY=your_temporal_api_key
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

### API Response Examples

**Create Workflow Response:**
```json
{
  "id": "uuid-string",
  "message": "Workflow created"
}
```

**Execute Workflow Response:**
```json
{
  "execution_id": "uuid-string",
  "status": "completed|failed",
  "logs": [
    {
      "node_id": "node-123",
      "node_name": "HTTP Request",
      "node_type": "http_request",
      "status": "completed",
      "input": {"message": "Hello"},
      "output": {"response": "Hi there!"},
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🎨 Usage Guide

### Creating a Workflow
1. Enter workflow name in the top input box
2. Click nodes from the **Node Palette** (left sidebar) to add them
3. **Connect nodes** by dragging from output handle (right side) to input handle (left side)
4. **Click a node** to configure its settings in the right panel
5. Click **💾 Save** to persist to database
6. Click **▶️ Run** to execute

### How to Connect Nodes
- Drag from the **right side** (output) of one node
- Drop on the **left side** (input) of another node
- For Decision nodes: use **T** (green) or **F** (red) handles for branching

### Node Configuration
| Node | Settings |
|------|----------|
| **Manual Trigger** | Edit input payload JSON |
| **HTTP Request** | Set URL, method (GET/POST/PUT/DELETE), headers, body, retry settings |
| **Transform** | Choose transformation type, set target field |
| **Decision** | Set field, operator (equals, contains, greater_than, etc.), value |
| **Wait** | Set duration and unit (seconds/minutes/hours) |

### Bonus Features
- **Undo:** Press Ctrl+Z
- **Redo:** Press Ctrl+Y
- **Dark Mode:** Click the 🌙/☀️ button
- **History:** Click the 📜 History tab
- **Clear Workflow:** Click ➕ New button

---

## 🗄️ Database Schema

### workflows
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID primary key |
| name | TEXT | Workflow name |
| description | TEXT | Workflow description |
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

- API keys stored in environment variables (never committed to git)
- CORS configured for production domains
- Input validation via Pydantic models
- SQL injection prevention via Supabase SDK

---

## 🔧 Troubleshooting

### "Save failed" Error
1. Check if backend is running: `http://localhost:8000/health`
2. Verify Supabase environment variables are set
3. Check Render logs for backend errors

### "Workflow not found" Error
1. Save the workflow first before running
2. Ensure workflow ID is properly tracked in frontend

### Connection Line Not Appearing
1. Ensure nodes have handles (input on left, output on right)
2. Check CustomNode.tsx for proper Handle component setup

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
