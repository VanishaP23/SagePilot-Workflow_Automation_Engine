# SagePilot Workflow Automation Engine

A powerful visual workflow automation engine inspired by n8n, Temporal, and Zapier. Build, execute, and monitor workflows with an intuitive drag-and-drop interface backed by durable execution capabilities.

![Workflow Builder](https://img.shields.io/badge/Workflow-Builder-blue)
![Temporal](https://img.shields.io/badge/Temporal-Durable%20Execution-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-purple)

## 🚀 Live Demo

- **Frontend:** https://sage-pilot-workflow-automation-engine-4wby1papr.vercel.app
- **Backend API:** https://sagepilot-workflow-automation-engine.onrender.com

---

## ✨ Features

### Core Features
- **Visual Workflow Builder** - Drag-and-drop interface with React Flow
- **7 Node Types** - Manual, Webhook, HTTP Request, Transform, Decision, Wait, End
- **Real-time Execution** - Monitor workflow execution with live status updates
- **Durable Execution** - Powered by Temporal for fault-tolerant workflows
- **Retry Configuration** - Customizable retry policies for each node

### Bonus Features ✅
- **Undo/Redo** - Full history navigation with Ctrl+Z / Ctrl+Y
- **Execution Status Polling** - Real-time execution monitoring
- **Workflow History** - Complete audit trail of all executions
- **Dark Mode** - Toggle between light and dark themes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SagePilot Workflow Engine                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14)          Backend (FastAPI)           │
│  ┌───────────────────┐           ┌───────────────────┐      │
│  │  React Flow       │           │  REST API         │      │
│  │  Node Palette     │  ──────►  │  Temporal Client  │      │
│  │  Config Panel     │           │  Supabase DB      │      │
│  │  Execution Status │  ◄──────  │                   │      │
│  └───────────────────┘           └───────────────────┘      │
│                                       │                      │
│                              ┌────────┴────────┐             │
│                              ▼                 ▼             │
│                        Supabase          Temporal Cloud      │
│                      (PostgreSQL)        (Workflow Engine)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Node Types

| Node | Description | Configuration |
|------|-------------|---------------|
| **Manual Trigger** | Start workflow manually | Name, Description |
| **Webhook Trigger** | Start workflow via HTTP webhook | Webhook URL (auto-generated) |
| **HTTP Request** | Make external API calls | URL, Method, Headers, Body, Retry Settings |
| **Transform Data** | Transform input data | JavaScript expression |
| **Decision** | Branch based on condition | Condition expression (True/False branches) |
| **Wait** | Pause execution (Temporal timers) | Duration in seconds/minutes |
| **End** | Terminate workflow | Output message |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React Flow
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Workflow Engine:** Temporal Cloud
- **API Documentation:** Auto-generated Swagger UI

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

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
```
Open http://localhost:3000

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API available at http://localhost:8000

### Environment Variables
Create a `.env` file in the backend directory:
```env
SUPABASE_URL=https://wglojqkqycsibloronjx.supabase.co
SUPABASE_KEY=sb_secret_p6saOleMdmVvjele_UGr2g_hOaNUsZK
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

### Execution
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/execute/{workflow_id}` | Execute a workflow |
| GET | `/api/execution/{execution_id}/status` | Get execution status |
| POST | `/api/webhooks/trigger/{workflow_id}` | Trigger via webhook |

### History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history` | Get all execution history |
| GET | `/api/history/{workflow_id}` | Get history for specific workflow |

---

## 🎨 Usage Guide

### Creating a Workflow
1. Click "New Workflow" in the sidebar
2. Drag nodes from the palette onto the canvas
3. Connect nodes by dragging from output handles to input handles
4. Click on a node to configure its settings
5. Click "Save Workflow" to persist

### Configuring Nodes
- **HTTP Request:** Enter URL, select method (GET/POST/PUT/DELETE), add headers and body
- **Transform:** Write JavaScript expressions to transform data
- **Decision:** Enter a condition that evaluates to true/false
- **Wait:** Set duration for the pause
- **Retry Settings:** Configure max retries, delay, and backoff multiplier

### Executing a Workflow
1. Click "Run" on the workflow canvas
2. Monitor execution in the "Status" tab
3. View detailed logs in the "History" tab

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+S | Save Workflow |
| Delete | Remove selected node |

---

## 🔧 Advanced Features

### Retry Configuration
Each HTTP Request node supports:
- **Max Retries:** Number of retry attempts (0-10)
- **Retry Delay:** Initial delay between retries (seconds)
- **Backoff Multiplier:** Exponential backoff factor

### Decision Branching
The Decision node creates two execution paths:
- **True Branch:** Executed when condition is truthy
- **False Branch:** Executed when condition is falsy

### Temporal Integration
Workflows are executed as Temporal workflows, providing:
- Automatic retry on failure
- State persistence across restarts
- Activity heartbeats for long-running tasks
- Workflow history and replay

---

## 📁 Project Structure

```
SagePilot-Workflow_Automation_Engine/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Main workflow builder page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── globals.css        # Global styles
│   │   ├── components/
│   │   │   ├── Canvas.tsx         # React Flow canvas
│   │   │   ├── NodePalette.tsx    # Node selection panel
│   │   │   ├── ConfigPanel.tsx    # Node configuration panel
│   │   │   ├── ExecutionStatus.tsx # Execution monitoring
│   │   │   ├── WorkflowHistory.tsx # Execution history
│   │   │   └── nodes/
│   │   │       └── CustomNode.tsx  # Custom node components
│   │   └── store/
│   │       └── workflowStore.ts   # Zustand state management
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point
│   │   ├── config.py              # Configuration management
│   │   ├── database.py            # Supabase client
│   │   ├── api/
│   │   │   ├── workflows.py       # Workflow CRUD endpoints
│   │   │   ├── execution.py       # Execution endpoints
│   │   │   ├── webhooks.py        # Webhook endpoints
│   │   │   └── history.py         # History endpoints
│   │   ├── temporal/
│   │   │   ├── client.py          # Temporal client
│   │   │   ├── workflows.py       # Workflow definitions
│   │   │   └── activities.py      # Activity implementations
│   │   └── models/
│   │       └── workflow.py        # Pydantic models
│   ├── Dockerfile
│   └── requirements.txt
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

### workflows
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Workflow name |
| description | TEXT | Workflow description |
| nodes | JSONB | Array of node definitions |
| edges | JSONB | Array of edge definitions |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### executions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| workflow_id | UUID | Foreign key to workflows |
| status | TEXT | pending/running/completed/failed |
| started_at | TIMESTAMP | Start time |
| completed_at | TIMESTAMP | End time |
| logs | JSONB | Execution logs |
| result | JSONB | Execution result |

---

## 🔐 Security

- API keys stored in environment variables
- CORS configured for frontend domain
- Input validation on all endpoints
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

- [React Flow](https://reactflow.dev/) - For the visual node-based editor
- [Temporal](https://temporal.io/) - For durable workflow execution
- [Supabase](https://supabase.com/) - For database and authentication
- [n8n](https://n8n.io/) - For workflow automation inspiration
- [Zapier](https://zapier.com/) - For automation platform inspiration

---

<p align="center">
  Built with ❤️ for the SagePilot Internship Application
</p>
