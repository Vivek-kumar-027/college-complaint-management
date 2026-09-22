# CampusResolve — College Complaint Management System

A full-stack, enterprise-grade web application designed to digitize, streamline, and audit grievance redressal across campus departments. Built using the **MERN stack** (MongoDB, Express, React 18, Node.js), Vite, and Tailwind CSS.

---

## 1. Project Name

**CampusResolve** — *College Complaint Management System*

---

## 2. Problem Statement

In most higher-education institutions, student grievances—ranging from failing classroom projectors and disrupted hostel Wi-Fi to broken lab equipment and cleanliness concerns—are handled through physical register books, informal verbal complaints, or chaotic email threads. This traditional approach suffers from:
- **Zero Accountability**: Complaints are frequently lost, overlooked, or left unresolved for weeks.
- **Lack of Transparency**: Students have no visibility into who is working on their ticket or the estimated resolution timeline.
- **No Direct Routing**: General administration spends hours manually sorting issues and relaying them to technicians.
- **No Feedback Mechanism**: Once an issue is physically marked "fixed," there is no way to confirm if the student was actually satisfied.
- **Absence of Performance Metrics**: Campus leadership lacks analytical data on recurring problems, departmental bottlenecks, and average resolution times.

**CampusResolve** solves these challenges by providing a centralized, role-based platform where students report issues with photographic evidence and track resolutions via a visual 6-stage stepper, while administrators dispatch tickets to specialized departments, monitor live analytics, and manage student access.

---

## 3. Features

###  Core Student Features
- **Restricted, Role-Based Authentication**: Secure JWT-based login for students authorized by the college administration (with `bcryptjs` password encryption).
- **Student Metrics Dashboard**: Real-time counter cards showing total complaints filed, issues currently pending, and successfully resolved tickets.
- **Multi-Category Complaint Submission**:
  - Categorization across *Classroom, Laboratory, Hostel, Wi-Fi, Infrastructure, Transportation, Cleanliness,* and *Other*.
  - Detailed title, description, and exact physical campus location input.
  - Optional photo/document attachment upload (JPG, PNG, PDF up to 5MB).
  - Urgency priority selection (*Low, Medium, High, Critical*).
- **Visual 6-Stage Progress Stepper**: Real-time visual lifecycle tracker:
  $$\text{Submitted} \rightarrow \text{Under Review} \rightarrow \text{Assigned} \rightarrow \text{In Progress} \rightarrow \text{Resolved} \rightarrow \text{Closed}$$
- **Resolution Rating & Feedback Loop**: Upon resolution, students submit a 1–5 star rating and closing satisfaction remarks to finalize the ticket.
- **Two-Way Audit & Comment Trail**: Interactive timestamped message thread between student and administration for ongoing updates.

###  Core Administrator Features
- **Centralized Complaints Registry**: Unified table with multi-criteria filtering by Status, Category, Priority, Department, and real-time text search.
- **Workflow & Lifecycle Triage**: Advance complaint statuses with automatic timestamping and public audit remarks.
- **Department Routing**: Dispatch tickets to campus service wings (*IT & Wi-Fi Support, Hostel Administration, Estate & Infrastructure, Transport Wing, Campus Sanitation, Academic Facilities*) and assign technicians.
- **Resolution Documentation**: Record specific corrective actions and repairs before resolving tickets.
- **Analytics & Trends Dashboard**: Visual statistics highlighting ticket volume, department distributions, priority breakdowns, and average resolution duration in hours.

###  Bonus & Advanced Features
- **In-App Student Credential Management**: Administrators can provision new student accounts directly through the UI with custom or auto-generated passwords and instant credential copying.
- **Live Search & Multi-Filters**: Instant client-side and server-side querying across issue titles, roll numbers, and categories.
- **Responsive Modern UI**: Glassmorphic styling built with Tailwind CSS, custom color palettes, and Lucide React icons.
- **Production-Ready Unified Architecture**: Express server configured to serve the compiled React Vite SPA and media uploads from a single endpoint with zero CORS overhead.

---

## 4. Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **React 18** | Component-based interactive user interface |
| **Build Tool** | **Vite** | Next-generation fast frontend tooling and bundling |
| **Styling & Icons** | **Tailwind CSS & Lucide React** | Utility-first responsive design system and SVG iconography |
| **Client Routing** | **React Router v6** | Client-side routing with role-based route guards |
| **HTTP Client** | **Axios** | Promise-based HTTP client with JWT interceptors |
| **Backend Runtime** | **Node.js** | Server-side JavaScript runtime environment |
| **Web Framework** | **Express.js** | RESTful API server architecture and middleware |
| **Database** | **MongoDB** | NoSQL document database hosted on **MongoDB Atlas** |
| **ODM** | **Mongoose** | Schema validation, pre-save hooks, and population queries |
| **Authentication** | **JWT & Bcrypt.js** | Stateless token authentication and salted password hashing |
| **File Storage** | **Multer** | Multipart file upload middleware for image/document proof |
| **Deployment** | **Render / Vercel** | Live production hosting and cloud database integration |

---

## 5. Screenshots

> *Note: Place your application screenshot files in the `docs/screenshots/` directory or replace the image links below.*

| Screen | Description | Preview |
|---|---|---|
| **Student Dashboard** | Live complaint summary cards, status badges, and recent ticket history | ![Student Dashboard](https://raw.githubusercontent.com/Vivek-kumar-027/college-complaint-management/main/client/public/favicon.svg) |
| **Complaint Details & Stepper** | 6-stage lifecycle stepper, uploaded photo attachment, and audit trail | ![Complaint Details](https://raw.githubusercontent.com/Vivek-kumar-027/college-complaint-management/main/client/public/favicon.svg) |
| **Admin Complaints Registry** | Central triage dashboard with category, priority, and department filters | ![Admin Registry](https://raw.githubusercontent.com/Vivek-kumar-027/college-complaint-management/main/client/public/favicon.svg) |
| **Student Provisioning Modal** | In-app administrative modal to generate student credentials | ![Student Provisioning](https://raw.githubusercontent.com/Vivek-kumar-027/college-complaint-management/main/client/public/favicon.svg) |
| **Analytics & Reports** | Resolution performance metrics, category breakdown, and average hours | ![Analytics Dashboard](https://raw.githubusercontent.com/Vivek-kumar-027/college-complaint-management/main/client/public/favicon.svg) |

---

## 6. Live Demo

- **Live Application URL**: [https://campus-resolve-krt0.onrender.com/](https://campus-resolve-krt0.onrender.com/)

---

## 7. Backend

- **Deployed Backend Base URL**: [https://campus-resolve-krt0.onrender.com/api](https://campus-resolve-krt0.onrender.com/api)
- **API Health Check Endpoint**: [https://campus-resolve-krt0.onrender.com/api/health](https://campus-resolve-krt0.onrender.com/api/health)

---

## 8. Setup Instructions

Follow these steps to run the complete project locally on your machine:

### Prerequisites
Ensure you have the following installed:
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas cloud URI

### 1. Clone the Repository
```bash
git clone https://github.com/Vivek-kumar-027/college-complaint-management.git
cd college-complaint-management
```

### 2. Install All Dependencies
Install root, backend, and frontend packages with a single command:
```bash
npm run install:all
```
*(Alternatively: `npm install && cd server && npm install && cd ../client && npm install`)*

### 3. Configure Environment Variables
Create a `.env` file in the `server` directory (or edit `server/.env`):
```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_complaint_db
JWT_SECRET=your_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string).*

### 4. Seed Default Database Data
Populate default campus departments, admin account, sample students, and pre-configured complaints:
```bash
npm run seed
```

### 5. Start the Development Server
Run both Express API server and Vite React client concurrently:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend Web Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 9. Environment Variables

Create a `.env` file in the `server` directory. The following variables are required:

| Variable Name | Required | Description | Example / Default |
|---|---|---|---|
| `PORT` | Yes | Port on which the Express server listens | `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string (local or cloud Atlas URI) | `mongodb://localhost:27017/college_complaint_db` |
| `JWT_SECRET` | Yes | Secret cryptographic key used to sign and verify JWT session tokens | `your_secret_key_here` |
| `CLIENT_URL` | Yes | URL of the frontend application allowed by CORS | `http://localhost:5173` (local) or `https://campus-resolve-krt0.onrender.com` |
| `VITE_API_BASE_URL` | Optional | Custom API base URL for decoupled frontend builds | `/api` |

>  **Important Security Notice**:
> Never commit `.env` files, API keys, database credentials, passwords, or JWT secrets to GitHub. Ensure `server/.env` and `client/.env` are listed in your [`.gitignore`](.gitignore) file.
