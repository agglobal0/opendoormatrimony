# Open Door Matrimony - The Open Door Church, Khojewala, Punjab

A production-ready **Christian Marriage Bureau / Matrimonial Web Application** developed for **The Open Door Church, Khojewala, Kapurthala - Jalandhar Road, Punjab, India**.

> **Motto:** Faith. Family. Forever.  
> **Scripture:** *“Therefore what God has joined together, let no one separate.” — Mark 10:9*

---

## 1. Project Architecture

The codebase is organized into two primary application folders:

```
todcmb/
├── backend/                  # Node.js + Express.js REST API + MySQL Engine
│   ├── src/
│   │   ├── config/           # Database pool, Mock memory store fallback, App constants
│   │   ├── controllers/      # Auth, Profile, Match, Interest, Saved, Report, Admin, CMS, Contact
│   │   ├── middleware/       # JWT Auth, Role RBAC, Multer photo upload, Error handlers
│   │   ├── routes/           # REST API endpoints
│   │   ├── services/         # Compatibility scoring algorithm, Notifications, Audit logs
│   │   ├── utils/            # Privacy masking engine, Bcrypt password hashing, JWT
│   │   ├── validators/       # Input validation schemas
│   │   ├── app.js            # Express application with Helmet, CORS, Rate limiting
│   │   └── server.js         # Server bootstrap
│   ├── uploads/              # Profile photos storage
│   ├── package.json
│   └── .env.example
├── frontend/                 # React 18 + Vite + Tailwind CSS + React Router v6
│   ├── src/
│   │   ├── components/       # ProfileCard, VerificationBadge, SearchFilters, Navbar, Footer...
│   │   ├── context/          # AuthContext, SettingsContext (Church CMS)
│   │   ├── pages/            # Public (Home, About, Matches...), Member Dashboard, Admin Portal
│   │   ├── services/         # Axios API client with token interceptors
│   │   ├── App.jsx           # Protected & Admin route definitions
│   │   └── index.css         # Custom royal navy & warm gold design system
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── database/                 # Database DDL & Seed Scripts
│   ├── schema.sql            # 16 normalized relational tables with indexes & foreign keys
│   ├── seed.sql              # 40+ authentic Punjabi/Indian Christian profiles + CMS defaults
│   └── init_db.js            # Database auto-provisioner CLI
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Quick Setup & Installation

### Step 1: Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

---

### Step 2: Database Setup (MySQL)

Ensure MySQL is running on your machine, then run:

```bash
node database/init_db.js
```

*Note: If MySQL is not running on your machine during development, the backend automatically activates an integrated, high-performance in-memory relational store with all 40+ profiles and admin accounts ready.*

---

### Step 3: Run the Application

#### Start Backend Server (Port 5000):
```bash
cd backend
npm start
```

#### Start Frontend Dev Server (Port 5173):
```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 3. Demo Accounts & Credentials

All demo accounts share the password: `Password@123`

| Role | Email | Password |
|---|---|---|
| **Church Super Admin** | `admin@opendoormatrimony.org` | `Password@123` |
| **Pastoral Admin** | `pastoral@theopendoorchurch.org` | `Password@123` |
| **Groom Profile (Male)** | `joshua.masih@example.com` | `Password@123` |
| **Bride Profile (Female)** | `grace.matthew@example.com` | `Password@123` |

*(Quick 1-click login buttons are also available on the `/login` page for convenience).*

---

## 4. Key Platform Features

1. **Strict Privacy Model:** Mobile numbers and emails are never exposed publicly. They are only disclosed after mutual interest is accepted and pastoral introduction is requested.
2. **Church Verification Workflow:** Pastoral committee reviews submissions, pastor references, and water baptism details before granting the church-verified badge.
3. **Transparent Matching Algorithm:** Calculates compatibility percentage based on denomination alignment, age range, location, education, and lifestyle.
4. **Church-Facilitated Introductions:** Safe communication without unmonitored chatrooms or casual dating mechanics.
5. **Centralized Church CMS:** Church administrators can dynamically customize the platform title, tagline, pastoral contact, hero headings, and publish couple testimonies.
