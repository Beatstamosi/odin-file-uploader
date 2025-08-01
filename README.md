# 🚀 File Uploader – A Simplified Google Drive Clone

This is a full-stack file management app inspired by [The Odin Project's File Uploader project](https://www.theodinproject.com/lessons/nodejs-file-uploader). It serves as a hands-on practice project to strengthen my skills in Node.js, Express, and modern full-stack architecture. The app mimics a simplified version of Google Drive, allowing users to manage files and folders securely, with sharing capabilities.

> 🧪 Built as a learning project — but designed with clean code, scalability, and real-world patterns in mind.

---

## ✨ Features

- ✅ **Authentication with Passport.js**
  - Local strategy with username/email + password
  - Each user has a private file system
- 📂 **Folders**
  - Create, delete, and nest folders infinitely
- 📁 **Files**
  - Upload and delete files
  - File metadata stored in PostgreSQL
- ☁️ **Supabase Storage Integration**
  - Files are securely uploaded and served via Supabase buckets
- 🔗 **Sharing**
  - Share files and folders with other users
  - Generate public/private access links
- 🧩 **RESTful API**
  - Fully modular Express.js API design
- 🧰 **Tech Stack**
  - **Backend:** Node.js, Express.js, Passport, Prisma ORM
  - **Auth:** Passport.js (local strategy)
  - **Storage:** Supabase buckets
  - **Database:** PostgreSQL
  - **Frontend:** React (Vite) + Tailwind (if applicable)
  - **Deployment:** (Describe if hosted: Vercel, Render, etc.)

---

## 🔐 Authentication

- Passport.js handles login and session management
- Secure password hashing using bcrypt
- User sessions can be swapped for JWT authentication (future-proofed)

---

## ☁️ Supabase Integration

- All file uploads are streamed to Supabase storage
- Supabase storage keys and bucket configurations are secured via environment variables
- Files are accessed using signed URLs to prevent unauthorized access

---

## 📤 Upload & Management

- Uploads are tied to authenticated users
- Folder structures are persisted in the database with parent-child relationships
- Deleting a folder also deletes all nested contents (cascade)

---

## 🔗 File & Folder Sharing

- Users can generate links to share files and folders
- Publicly shared items can be accessed without authentication (configurable)
- Permissions (read-only for now; extendable to edit)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- Supabase account + configured bucket

### Environment Setup

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
SESSION_SECRET=your_session_secret
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_service_role_key
SUPABASE_BUCKET=your_bucket_name

### Install & Run

# Backend
cd server
npm install

# Frontend
cd client
npm install

# main folder
npm install
npm run dev from main folder to run backend and frontend simultaneously.

Project built as part of The Odin Project curriculum.
