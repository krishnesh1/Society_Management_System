#  Society Management System

A full-stack web application built to manage residential societies and apartment complexes. It provides a centralized dashboard to track daily activities, maintenance bills, community discussions, and visitor management.

---

##  Features

-  **User Management**
  - Manage resident profiles and role-based admin access.

-  **Announcements & Events**
  - Share important notices and upcoming community events.

-  **Billing System**
  - Generate and track maintenance bills and payment status.

-  **Complaint Resolution**
  - Residents can raise complaints (plumbing, electrical, etc.), and administrators can manage their status.

-  **Visitor Tracking**
  - Maintain records of expected and past visitors.

-  **Community Polls**
  - Create polls for society-wide decision-making.

---

##  Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JSON Web Token (JWT)

---

##  Local Setup

### Prerequisites

Before running the project, ensure you have:

- Node.js installed
- MongoDB running locally **or** a MongoDB Atlas connection string
- Git installed

---

##  Environment Configuration

Create a `.env` file in both the **backend** and **frontend** directories.

Use the provided sample environment files as a template.

> ** Security Warning**
>
> Never commit your `.env` files to GitHub.
> Make sure they are included in your `.gitignore`.

---

##  Backend Installation

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

##  Frontend Installation

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

---

##  Project Structure

```
Society-Management-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
└── README.md
```

---

##  Authentication

- JWT-based authentication
- Protected routes
- Role-based authorization (Admin & Resident)

---

##  Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

##  License

This project is intended for educational purposes.