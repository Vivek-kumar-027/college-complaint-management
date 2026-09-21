# College Complaint Management System â€” Specification

**Difficulty:** Easy
**Type:** Web-based platform

## 1. Overview

A centralized digital platform that lets students report problems or complaints related to college facilities and track their resolution status in real time. The system replaces manual, paper-based or ad-hoc complaint processes (emails, verbal reports) with a structured digital workflow that connects students to the correct department or administrator.

## 2. Goals

- Give students a single place to submit and track complaints.
- Give admins/staff a structured way to review, assign, and resolve complaints.
- Provide visibility into complaint status at every stage, from submission to closure.
- Replace informal/manual complaint handling with an auditable digital record.

## 3. User Roles

| Role | Description |
|---|---|
| **Student** | Registers, logs in, submits complaints, tracks status, views history |
| **Admin** | Reviews all complaints, assigns them to departments/staff, updates status, adds comments |
| **Department Staff** *(optional, can be merged with Admin in v1)* | Receives assigned complaints, updates progress, marks resolution |

## 4. Core Workflow

```
Student â†’ Submit Complaint â†’ Admin Reviews â†’ Assign Department/Staff
   â†’ Complaint In Progress â†’ Issue Resolved â†’ Student Views Resolution
```

### Complaint Status Lifecycle

```
Submitted â†’ Under Review â†’ Assigned â†’ In Progress â†’ Resolved â†’ Closed
```

- **Submitted** â€” Student has created the complaint.
- **Under Review** â€” Admin has seen it and is evaluating priority/department.
- **Assigned** â€” Complaint routed to a department or staff member.
- **In Progress** â€” Work has started on resolving the issue.
- **Resolved** â€” Issue fixed; resolution details recorded.
- **Closed** â€” Student has acknowledged/confirmed resolution, or auto-closed after a period.

## 5. Feature List

### 5.1 Must-Have / Core Features

**Authentication & Users**
- Student registration and login (email/password, college ID optional)
- Role-based access (Student vs Admin)

**Student-Facing**
- Student Dashboard â€” overview of own complaints and statuses
- Complaint Submission form:
  - Category (Classroom, Laboratory, Hostel, Wi-Fi, Infrastructure, Transportation, Cleanliness, Other)
  - Detailed description
  - Location of the issue
  - Image/file attachment (optional)
- Complaint History â€” list of previously submitted complaints
- Complaint Details Page â€” full detail + current status + admin comments
- Complaint Status Tracking (visual, e.g., stepper/timeline)

**Admin-Facing**
- Admin Dashboard â€” list/overview of all complaints
- Admin Complaint Management â€” view, filter, update complaints
- Department/Staff Assignment â€” assign a complaint to a department or person
- Complaint Priority â€” Low / Medium / High / Critical
- Complaint Status Management â€” move complaint through lifecycle
- Admin Comments/Updates â€” add notes visible to the student
- Resolution Details â€” what was done to fix the issue
- Search and Filter Complaints â€” by status, category, priority, date, department

**System / Technical**
- Complaint Data Storage â€” persistent database
- CRUD/API functionality for complaints, users, categories
- Frontendâ€“Backend integration
- Basic Complaint Statistics (counts by status/category)
- Working deployed application (publicly accessible URL)

### 5.2 Bonus / Optional Features

- Email notifications on status change
- Real-time status notifications (WebSockets/push)
- Admin analytics dashboard (charts, trends)
- Department-wise statistics
- Complaint resolution time tracking (avg. time to resolve)
- Student feedback after resolution
- Complaint resolution rating (e.g., 1â€“5 stars)
- Duplicate complaint detection
- AI-based complaint categorization
- AI-generated complaint summaries
- Image-based issue classification
- Automatic escalation for unresolved complaints (e.g., after X days)
- Mobile-responsive / PWA interface

## 6. Data Model (Suggested)

Collections below are modeled for **MongoDB** (via Mongoose schemas); `ObjectId` is Mongo's native reference type.

### User
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK (auto) |
| name | String | |
| email | String | unique, indexed |
| passwordHash | String | bcrypt hash |
| role | String (enum) | `student`, `admin` |
| studentId / rollNo | String | optional |
| createdAt | Date | |

### Complaint
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK (auto) |
| student | ObjectId (ref: User) | |
| category | String (enum) | Classroom, Laboratory, Hostel, Wi-Fi, Infrastructure, Transportation, Cleanliness, Other |
| description | String | |
| location | String | |
| attachmentUrl | String | optional |
| priority | String (enum) | Low, Medium, High, Critical |
| status | String (enum) | Submitted, Under Review, Assigned, In Progress, Resolved, Closed |
| assignedDepartment | String / ObjectId (ref: Department) | null until assigned |
| assignedStaff | ObjectId (ref: User) | null until assigned |
| resolutionDetails | String | null until resolved |
| createdAt | Date | |
| updatedAt | Date | |

### Comment / Update Log
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK (auto) |
| complaint | ObjectId (ref: Complaint) | |
| author | ObjectId (ref: User) | admin or student |
| message | String | |
| statusChange | String (enum), optional | if the comment triggered a status update |
| createdAt | Date | |

### Department (optional collection)
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | PK (auto) |
| name | String | e.g., Hostel Admin, IT/Wi-Fi, Maintenance |

## 7. Suggested API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/complaints              # list (filtered by role: own for student, all for admin)
POST   /api/complaints              # create (student)
GET    /api/complaints/:id          # detail
PATCH  /api/complaints/:id          # update status, priority, assignment, resolution (admin)
POST   /api/complaints/:id/comments # add comment/update
GET    /api/complaints/:id/comments

GET    /api/categories
GET    /api/departments

GET    /api/stats                   # basic counts by status/category (admin)
```

## 8. Tech Stack

This project uses the **MERN stack** (MongoDB, Express, React, Node.js) â€” a single language (JavaScript/TypeScript) across the whole app, fast to prototype, and well suited to the CRUD-heavy, document-like nature of complaints and comments.

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React (Vite) | Component-based UI; separate dashboards for Student and Admin |
| **Backend** | Node.js + Express | REST API serving JSON to the frontend |
| **Database** | MongoDB (via Mongoose) | Flexible schema; complaints can embed or reference comments/status history |
| **Authentication** | JWT + bcrypt | Stateless auth; bcrypt for password hashing, JWT for session tokens |
| **File Uploads** | Multer (local disk) or Cloudinary (cloud) | For complaint image/file attachments |
| **State Management (frontend)** | React Context or Redux Toolkit | For auth state and complaint data caching |
| **Styling** | Tailwind CSS | Fast, responsive UI without heavy custom CSS |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas (database) | All have free tiers, suitable for an easy-level student project |

### Key npm Packages

- Backend: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `dotenv`
- Frontend: `react`, `react-router-dom`, `axios`, `tailwindcss`

## 9. Non-Functional Requirements

- Complaint data must persist reliably (no data loss on refresh/restart).
- Role-based access control: students can only see/edit their own complaints; admins can see/manage all.
- Basic input validation (required fields, file type/size limits for attachments).
- Responsive layout usable on both desktop and mobile browsers.
- Application must be publicly deployed and accessible via a URL.

## 10. Milestones (Suggested Build Order)

1. Set up backend + database schema (Users, Complaints, Comments).
2. Implement authentication (register/login) for students and admin.
3. Build complaint submission form + student dashboard + history view.
4. Build admin dashboard: list, filter, search complaints.
5. Implement status lifecycle transitions + assignment + priority.
6. Implement comments/updates and resolution details.
7. Add basic statistics (counts by status/category).
8. Polish UI, add file attachment support.
9. Deploy frontend + backend.
10. (Optional) Add bonus features: notifications, analytics, ratings, AI categorization, etc.

## 11. Success Criteria

- A student can register, log in, submit a complaint with category/description/location/attachment, and track it through its full lifecycle.
- An admin can log in, view all complaints, assign them, change priority/status, and add resolution notes.
- Data persists in a database and is served through a working API.
- The application is deployed and reachable via a public URL.
