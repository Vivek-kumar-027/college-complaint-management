# CampusResolve â€” College Complaint Management System

A full-stack web-based platform that centralizes and digitizes campus issue reporting, ticket routing, and resolution tracking. Built using the **MERN stack** (MongoDB, Express, React, Node.js), Tailwind CSS, and Vite.

---

## âœ¨ Key Features

### ðŸŽ“ For Students
- **Secure Role-Based Authentication**: Dedicated sign-in for pre-authorized students and staff provisioned in the database. Features JWT session tokens and bcrypt password encryption (public registration is disabled).
- **Student Dashboard**: Live counts of total, pending, and resolved complaints.
- **Complaint Submission**:
  - Category selection (*Classroom, Laboratory, Hostel, Wi-Fi, Infrastructure, Transportation, Cleanliness, Other*)
  - Detailed description & location input
  - Optional photo/document attachment (up to 5MB)
  - Urgency level (*Low, Medium, High, Critical*)
- **Visual Lifecycle Progress Stepper**: Real-time tracker showing transitions across:
  $$\text{Submitted} \rightarrow \text{Under Review} \rightarrow \text{Assigned} \rightarrow \text{In Progress} \rightarrow \text{Resolved} \rightarrow \text{Closed}$$
- **Resolution Feedback & Rating**: Students can rate completed fixes (1â€“5 stars) and submit satisfaction remarks to close the ticket.
- **Interactive Comment Log**: Continuous audit trail between student and administration.

### ðŸ›¡ï¸ For Administrators
- **Comprehensive Complaints Registry**: Centralized dashboard with multi-criteria filtering by Status, Category, Priority, Department, and real-time Search.
- **Workflow & Lifecycle Management**: Move complaints through all stages with automatic timestamping and public audit remarks.
- **Department Routing**: Assign tickets to responsible campus departments (*Hostel Admin, IT & Wi-Fi Support, Estate & Infrastructure, Transport Wing, Campus Sanitation, Academic Affairs*) and designated staff/technicians.
- **Resolution Recording**: Document specific corrective measures taken before resolving complaints.
- **Student Credentials & Access Management**: Dedicated "Manage Students" portal to provision new student accounts with custom or auto-generated passwords, view authorized student rosters, and manage access.
- **Analytics & Trends Dashboard**: Visual statistics showing ticket volume, category distribution, priority breakdown, and average resolution times in hours.

---

## ðŸ§° Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Morgan, Bcrypt.js
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## ðŸš€ Prerequisites

Before running the project locally, ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Either a local MongoDB instance running on port `27017` or a free MongoDB Atlas connection string.

---

## ðŸ’» Step-by-Step Local Setup Guide

### 1. Clone or Navigate to the Workspace
Open your terminal (PowerShell, Command Prompt, or Bash) and navigate to the project root directory:
```bash
cd E:\NxtWave\Collage_management
```

### 2. Install All Dependencies
You can install dependencies for root, server, and client with a single command:
```bash
npm run install:all
```
*(Alternatively, install each individually: `npm install && cd server && npm install && cd ../client && npm install`)*

### 3. Configure Environment Variables
A default `.env` file is already created in `server/.env`. If you need to customize it:
```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_complaint_db
JWT_SECRET=campus_resolve_jwt_super_secret_key_2026_nxtwave
CLIENT_URL=http://localhost:5173
```
> **Note for MongoDB Atlas Users**: If using MongoDB Atlas in the cloud, simply replace `MONGODB_URI` with your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/college_complaint_db`).

### 4. Seed the Database with Demo Data
Populate standard departments, sample student and administrator accounts, and pre-configured complaints across all statuses:
```bash
npm run seed
```

### 5. Start the Application
Run both the Express backend API and Vite React client simultaneously with:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend Web Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---



> 🔒 **Restricted Access Policy**: Public student self-registration is disabled. Access is strictly limited to authorized students whose credentials are provisioned in the database by administrators (or via `npm run seed`).

---

## ðŸ“ Project Structure

```
Collage_management/
â”œâ”€â”€ client/                      # React Frontend (Vite + Tailwind CSS)
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ api/client.js        # Axios instance with JWT interceptor
â”‚   â”‚   â”œâ”€â”€ context/AuthContext  # Authentication state & session store
â”‚   â”‚   â”œâ”€â”€ components/          # StatusBadge, PriorityBadge, StatusStepper, FilterBar, StatsCard, Navbar
â”‚   â”‚   â”œâ”€â”€ pages/               # Login, Register, StudentDashboard, SubmitComplaint, ComplaintDetails, AdminDashboard, AdminAnalytics
â”‚   â”‚   â”œâ”€â”€ App.jsx              # Application router with role protection
â”‚   â”‚   â””â”€â”€ main.jsx             # React DOM root
â”‚   â”œâ”€â”€ vite.config.js           # Vite dev proxy configuration
â”‚   â””â”€â”€ tailwind.config.js       # Tailwind CSS theme configuration
â”œâ”€â”€ server/                      # Node.js Express REST API
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ config/db.js         # Mongoose connection handler
â”‚   â”‚   â”œâ”€â”€ models/              # User, Complaint, Comment, Department schemas
â”‚   â”‚   â”œâ”€â”€ controllers/         # Auth, Complaint, Comment, and Stats business logic
â”‚   â”‚   â”œâ”€â”€ routes/              # Express API endpoint definitions
â”‚   â”‚   â”œâ”€â”€ middleware/          # JWT auth protect, role guard, Multer file upload, error handler
â”‚   â”‚   â”œâ”€â”€ seed/seedData.js     # Demo database population script
â”‚   â”‚   â””â”€â”€ server.js            # Express server initialization
â”‚   â””â”€â”€ uploads/                 # Local directory for issue attachments
├── package.json                 # Monorepo orchestration scripts
├── spec.md                      # Project specification sheet
├── deploy.md                    # Step-by-step production deployment guide
└── README.md                    # Project documentation & setup instructions
```

---

## 🛠️ Available NPM Scripts

From the root directory:
- `npm run install:all` — Installs dependencies for root, server, and client.
- `npm run build` — Builds the full-stack app for production deployment.
- `npm start` — Starts the Express production server.
- `npm run dev` — Runs both server and client concurrently in development.
- `npm run seed` — Reseeds the MongoDB database with default departments & users.
- `npm run server` — Runs only the Express backend on port 5000.
- `npm run client` — Runs only the Vite frontend dev server on port 5173.

---

## ðŸ“¡ REST API Reference

### Authentication & User Provisioning
- `POST   /api/auth/login` — Authenticate and receive JWT token
- `GET    /api/auth/me` — Retrieve current user profile (requires Bearer token)
- `GET    /api/auth/admin/students` — List all authorized student accounts (Admin only)
- `POST   /api/auth/admin/create-user` — Provision new student or staff credentials (Admin only)
- `DELETE /api/auth/admin/students/:id` — Remove student access (Admin only)
- `POST   /api/auth/register` — *(Disabled)* Returns `403 Forbidden` (student credentials must be provisioned in database)

### Complaints
- `GET    /api/complaints` â€” List complaints (students see own; admins see all; supports `status`, `category`, `priority`, `department`, `search`)
- `POST   /api/complaints` â€” Submit new complaint with optional `multipart/form-data` file attachment
- `GET    /api/complaints/:id` â€” Retrieve single complaint with student details and comment history
- `PATCH  /api/complaints/:id` â€” Admin update for status, priority, department, staff, and resolution details
- `POST   /api/complaints/:id/feedback` â€” Student submit 1â€“5 star rating and feedback
- `DELETE /api/complaints/:id` â€” Delete complaint (admin or owning student if still in `Submitted` status)

### Comments & Logs
- `GET  /api/complaints/:id/comments` â€” List comments and status log events
- `POST /api/complaints/:id/comments` â€” Post comment or update status remark

### System & Statistics
- `GET /api/stats` â€” Total, pending, resolved counts, resolution times, category breakdown
- `GET /api/categories` â€” Predefined categories, priorities, and statuses
- `GET /api/departments` â€” Campus departments list
- `GET /api/health` â€” Health check endpoint

---

## ðŸ” Troubleshooting

- **MongoDB connection refused (`ECONNREFUSED 127.0.0.1:27017`)**:
  Make sure MongoDB is running. On Windows, start the service using PowerShell (Run as Administrator):
  ```powershell
  Start-Service -Name MongoDB
  ```
- **Port 5000 or 5173 already in use**:
  You can change `PORT` in `server/.env` or specify a different Vite port in `client/vite.config.js`.
