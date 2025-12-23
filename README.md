# Notice Management System

A full-stack web application designed for corporate notice management, featuring role-based targeting, real-time status updates, and a responsive modern UI.

## 🚀 Live Demo

- **Frontend:** [Link to Vercel/Render Deployment]
- **Backend API:** [Link to Backend Deployment]
- **Swagger Docs:** [Link to Backend Deployment]/api/docs

## 🛠️ Tech Stack

**Frontend:**

- **Framework:** Next.js 16 (React 19)
- **Styling:** TailwindCSS, Shadcn/UI
- **State Management:** Redux Toolkit / RTK Query
- **Validation:** Zod + React Hook Form

**Backend:**

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Documentation:** Swagger UI

## ✨ Key Features

- **Create Notices:** Rich text support with validation.
- **Dynamic Targeting:** Target specific Departments or Individuals.
- **Advanced Filtering:** Filter by Status (Draft/Published), Department, or Search by Title/Name.
- **Pagination:** Server-side pagination for optimized performance.
- **Status Management:** One-click toggle to publish/unpublish notices.

## ⚙️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nebs-test
   ```

2. **Environment Setup:**
   Create a `.env` file in `backend/` and `.env.local` in `frontend/`. See `.env.example` for reference.

   **Backend (.env):**

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   PORT=4000
   ```

   **Frontend (.env.local):**

   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   ```

3. **Run with Docker (Recommended):**

   ```bash
   docker-compose up --build
   ```

4. **Manual Run:**
   - **Backend:** `cd backend && npm install && npm run start:dev`
   - **Frontend:** `cd frontend && npm install && npm run dev`

## 📧 Contact & Submission

**Submitted by:** [Your Name]
**Email:** mrnad@example.com
**Repository:** [GitHub Link]
