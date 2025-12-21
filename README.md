
# 🚀 **Qubit-Forge-Quest**

### **A Decentralized Compute Economy for the Qubic Ecosystem**

Qubit-Forge-Quest (QFQ) is a **decentralized compute marketplace** that connects:

* **Creators** needing compute
* **Investors** providing liquidity
* **An automatic execution engine** running tasks

Built for the **Nostromo Launchpad Track** of the
⭐ *Qubic — Hack the Future Hackathon*,
the project demonstrates how computation can become a **transparent, scalable, and fair on-chain economy**.

---

# 🔗 **Project Links**

### 🌐 **Live Frontend Demo**

👉 [https://qubit-forge-quest-front.vercel.app/](https://qubit-forge-quest-front.vercel.app/)

### 🖥️ **Backend API**

👉 [https://qubit-forge-quest-back.onrender.com/](https://qubit-forge-quest-back.onrender.com/)

### 📚 **GitHub Repositories**

**Frontend:**
👉 [https://github.com/tasnim-mtir/qubit-forge-quest-front](https://github.com/tasnim-mtir/qubit-forge-quest-front)

**Backend:**
👉 [https://github.com/tasnim-mtir/qubit-forge-quest-back](https://github.com/tasnim-mtir/qubit-forge-quest-back)

---

# ⭐ **Table of Contents**

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [User Roles & Dashboards](#user-roles--dashboards)
5. [Automatic Task Processor](#automatic-task-processor)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [API Overview](#api-overview)
9. [Environment Variables](#environment-variables)
10. [Local Setup](#local-setup)
11. [Deployment](#deployment)
12. [Roadmap](#roadmap)
13. [Team](#team)
14. [License](#license)

---

# 📌 **Overview**

Traditional compute systems are:

❌ Centralized
❌ Expensive
❌ Limited
❌ Unfair

Qubit-Forge-Quest introduces a **compute economy** where:

* **Creators** submit compute tasks and pay in Compute Credits (CC)
* **Investors** stake QX tokens to generate CC yield
* **Processors** run tasks with simulated parallel compute
* **Admins** keep the system healthy

The entire platform runs an economic simulation of how compute could be tokenized on **Qubic + Nostromo**.

---

# ✨ **Key Features**

### 🔐 Authentication & Access Control

* JWT-based login
* Google OAuth integration
* Role-based access (User → Creator / Investor → Admin)
* Users can request role upgrades
* Admins approve requests
* Secure session management

---

### 👨‍💻 Creator Features

* Create compute tasks with:

  * Name
  * Description
  * Priority
  * Cost (CC)
  * Estimated duration
* View all tasks: Queued / Running / Completed / Failed
* Monitor real-time queue position
* Check CC balance
* Download task results

---

### 💰 Investor Features

* Stake QX → Earn Compute Credits (CC)
* View active stakes
* CC rewards tracking
* Explore compute leasing options
* Analyze ROI and portfolio metrics

---

### ⚙️ Admin Features

* Approve role upgrade requests
* Manage users and ban/unban
* Global ecosystem metrics:

  * Total QX staked
  * Total CC minted
  * CC consumption
  * Task execution stats
* View vault health
* Monitor automatic processor

---

### ⚡ Automatic Task Processor (Background Engine)

This is the **core innovation** of the project.

The engine:

* Continuously monitors the queue
* Executes tasks automatically
* Supports parallel execution
* Simulates compute time
* Logs execution events
* Performs auto-retries
* Updates vault metrics

It demonstrates how a decentralize compute-worker network would behave.

---

# 🧱 **System Architecture**

```
                ┌──────────────────────────┐
                │         FRONTEND          │
                │ React + Vite + Tailwind   │
                │ Dashboards + Google Auth  │
                └──────────────┬────────────┘
                               │
                               ▼
               ┌──────────────────────────────┐
               │          BACKEND API          │
               │ Node.js + Express + Mongoose  │
               │ Auth • Tasks • Staking • Vault │
               └──────────────┬───────────────┘
                               │
                               ▼
               ┌──────────────────────────────┐
               │        AUTOMATIC PROCESSOR     │
               │  Queue → Running → Completed   │
               │  Parallel execution engine     │
               └──────────────┬───────────────┘
                               │
                               ▼
               ┌──────────────────────────────┐
               │        MongoDB Atlas          │
               │   Users • Tasks • Stakes      │
               │   Vault • Leases • Requests   │
               └──────────────────────────────┘
```

---

# 🧑‍💻 **User Roles & Dashboards**

### 👨‍💻 Creator Dashboard

* CC balance
* Task creation
* Task history
* Queue tracking
* Execution stats

---

### 💰 Investor Dashboard

* QX staking
* CC generation
* Leasing marketplace
* ROI metrics

---

### ⚙️ Admin Dashboard

* Role upgrade approvals
* User management
* Vault statistics
* System health
* Global analytics

---

# ⚡ **Automatic Task Processor (Engine)**

**Features:**

✔ Picks all queued tasks
✔ Runs them in **parallel**
✔ Simulates execution time
✔ Logs all execution events
✔ Auto-updates vault consumption
✔ Updates task status
✔ Success/failure simulation
✔ Works continuously in the background

---

# 🛠️ **Tech Stack**

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React, Vite, Tailwind, ShadCN       |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas, Mongoose             |
| Auth       | JWT, Google OAuth                   |
| Deployment | Vercel (Frontend), Render (Backend) |
| Processor  | Custom Node background worker       |

---

# 📁 **Project Structure**

```
backend/
│── models/
│── routes/
│── services/
│── middleware/
│── server.js
frontend/
│── src/
│── public/
│── index.html
README.md
```

---

# 🔌 **API Overview**

### **Auth Routes**

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/google
```

### **Creator / Tasks**

```
POST /api/protocol/compute-task/create
GET  /api/protocol/compute-task/my-tasks
PUT  /api/protocol/compute-task/:id/simulate-complete
```

### **Investor / Staking**

```
POST /api/protocol/stake
GET  /api/protocol/stake/user/:id
GET  /api/protocol/stake/all
```

### **Role Requests**

```
POST /api/request-role
GET  /api/pending-requests
PUT  /api/approve-request
```

### **System / Analytics**

```
GET /api/protocol/vault/stats
GET /api/protocol/processor/status
GET /api/protocol/analytics/network-metrics
```

---

# 🔐 **Environment Variables**

### **Backend `.env`**

```
MONGO_URI=
DATABASE_NAME=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
FRONTEND_URL=https://qubit-forge-quest-front.vercel.app
PORT=3000
```

### **Frontend `.env`**

```
VITE_API_URL=https://qubit-forge-quest-back.onrender.com
```

---

# 🧪 **Local Setup**

### **Backend**

```bash
cd backend
npm install
npm start
```

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

# 🚀 **Deployment Instructions**

### **Backend (Render)**

* Create new Web Service
* Add environment variables
* Deploy `server.js`

### **Frontend (Vercel)**

* Import GitHub repo
* Add `VITE_API_URL`
* Deploy

---

# 🛣️ **Roadmap**

* Real Qubic VM integration
* Smart contracts for staking & CC minting
* Distributed GPU execution backend
* Multi-node execution network
* Native Qubic tokenization of compute

---

# 👥 **Team**

### **Qubitium Team**

Tasnim Mtir & Razi Ammari.

---
# 🎉 **Thank You!**

If you enjoyed this project, ⭐ star the repo and share your feedback!



