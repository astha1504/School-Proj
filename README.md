# School Management System (SMS)
### Role-Based Digital Education Platform for Indian Schools

A modern, role-segregated School Management System (SMS) tailored for Indian primary, secondary, and higher secondary schools following CBSE, ICSE, and State Board educational benchmarks.

---

## Overview & Key Features

The **School Management System (SMS)** provides a centralized, role-based platform designed to manage and streamline academic, administrative, and student-related activities within a school. It features three dedicated dashboards for **Admin, Teachers, and Students**:

### 1. School Administrator Portal
- **Centralized Dashboard**: Real-time monitoring of total enrolled students, faculty strength, attendance averages, and fee collection metrics in Indian Rupees (`₹`).
- **Student & Staff Registry**: Comprehensive admission records, roll numbers, guardian contact info, and subject allocations.
- **Financial Oversight & Bursary**: Term-wise fee management, payment tracking, invoice generation, and financial reporting.
- **Institutional Settings**: Manage academic session calendars (e.g. 2026/2027), school announcements, branding, and grading parameters.

### 2. Teacher Portal
- **Class & Subject Management**: Designated class teacher views (e.g. *Class XII — Science A*), subject allocations, and daily period timetables.
- **Attendance & Grading**: Quick daily attendance marking, Continuous Assessment (CA1, CA2), and Terminal Examination scoring.
- **CBT & Assessment Studio**: Create timed online tests, objective/MCQ question banks, and automated result processing.

### 3. Student Portal
- **Personalized Scholar Hub**: Student profile card with Roll No, assigned class arm, and live attendance percentage.
- **Schedule & Timetable**: Real-time view of daily class periods, subject teachers, and classroom locations.
- **Fee Status & Receipts**: Clear breakdown of paid vs. pending tuition fees (`₹`), with payment history and downloadable clearance passes.
- **Notice Board & Materials**: School announcements, examination timetables, and subject study resources.

---

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend API**: Node.js, Express.js, MongoDB (Mongoose ORM).
- **Styling & UI**: Modern glassmorphism, responsive Tailwind design system, custom typography (Plus Jakarta Sans).

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/astha1504/School-Proj.git
cd School-Proj

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 3. Running Locally
```bash
# Start both Backend Server (Port 5000) & Next.js Frontend (Port 3030)
npm run dev
```

Visit [http://localhost:3030](http://localhost:3030) in your browser to access the portal.

### 4. Production Build
```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

---

## Demo Login Accounts

You can log in instantly using the demo cards on the login page:

| Role | Name | Identifier / Email | Portal Access |
|---|---|---|---|
| **Administrator** | Dr. Rajesh Kumar Sharma | `SRVM-ADMIN-001` / `admin@srvmschool.edu.in` | Full Admin Dashboard |
| **Teacher** | Mrs. Sunita Patel | `SRVM-TCH-042` / `teacher@srvmschool.edu.in` | Teacher Portal & Class XII-A |
| **Student** | Arjun Mehta | `SRVM/2024/XII/089` / `student@srvmschool.edu.in` | Student Portal |

---

