nano PROMPT.md
```

When the editor opens, paste this entire block:
```
# Bank Loan Application System — Full Build

## Goal
Build a complete, production-ready Bank Loan Application System from scratch.
Do not stop until fully complete.
Save progress notes to PROGRESS.md after each major milestone.
Commit to git after each major section is complete.

## Tech Stack
- Frontend: Angular 17+ (standalone components, Angular Material, Tailwind CSS)
- Backend: .NET 8 Web API (C#)
- Database: PostgreSQL with Entity Framework Core
- Auth: JWT Bearer tokens + ASP.NET Core Identity
- API Docs: Swagger / Swashbuckle

## Database Connection
- Host: localhost
- Port: 5432
- Database: loanappdb
- Username: loanapp
- Password: loanapp123

## Project Structure
/backend   — .NET 8 Web API
/frontend  — Angular 17+ app
README.md  — Full setup and run instructions
.env.example

## Roles
1. CUSTOMER — register, login, apply for loans, track application status
2. BANKER — review applications, approve/reject/request more info, add notes

## Backend Requirements (.NET 8 Web API)

### Architecture
- Clean architecture: Controllers → Services → Repositories → EF Core
- Separate DTOs for all requests and responses
- AutoMapper for entity to DTO mapping
- FluentValidation for all inputs
- Global exception handling middleware
- Serilog for structured logging

### Authentication & Authorization
- ASP.NET Core Identity for user management
- JWT Bearer token authentication
- Role-based authorization [Authorize(Roles = "Customer")] / [Authorize(Roles = "Banker")]
- Refresh token support
- Password hashing handled by Identity

### Entities
- ApplicationUser (extends IdentityUser): FirstName, LastName, Role, CreatedAt
- LoanApplication: Id, CustomerId, Amount, Type, Purpose, Tenure, MonthlyIncome, Status, CreatedAt, UpdatedAt
- LoanStatusHistory: Id, LoanApplicationId, Status, Note, ChangedById, ChangedAt
- BankerNote: Id, LoanApplicationId, BankerId, Note, CreatedAt

### Loan Types
- Personal Loan
- Home Loan
- Car Loan
- Business Loan
- Education Loan

### Loan Statuses
- Pending
- UnderReview
- Approved
- Rejected
- MoreInfoRequired

### API Endpoints
AUTH:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

CUSTOMER:
- GET  /api/loans/my
- POST /api/loans/apply
- GET  /api/loans/{id}
- GET  /api/loans/{id}/history

BANKER:
- GET  /api/banker/applications
- GET  /api/banker/applications/{id}
- PUT  /api/banker/applications/{id}/status
- POST /api/banker/applications/{id}/notes
- GET  /api/banker/applications/{id}/notes
- GET  /api/banker/stats

### Database Seeding
Seed these demo accounts on startup:
- Customer: customer@demo.com / Demo@1234 (Role: Customer)
- Banker: banker@demo.com / Demo@1234 (Role: Banker)
- 5 sample loan applications in various statuses

## Frontend Requirements (Angular 17+)

### Architecture
- Standalone components throughout
- Angular Router with lazy-loaded feature modules
- HTTP interceptors for JWT attachment and error handling
- Auth guard for protected routes
- Role guard to separate Customer and Banker areas
- Reactive Forms for all forms
- Angular Signals for state where appropriate

### Pages & Components

SHARED:
- Landing/home page with hero section and features
- Login page (email + password, with role selection)
- Register page (full name, email, password, role selection)
- 404 Not Found page

CUSTOMER AREA (/customer/...):
- Dashboard: welcome card, loan summary stats, recent applications list
- Apply for Loan: multi-step form (step 1: loan details, step 2: personal/income info, step 3: review & submit)
- My Applications: table with status badges, search, filter by status
- Application Detail: full info, status timeline, documents section

BANKER AREA (/banker/...):
- Dashboard: stats cards (total, pending, approved, rejected), recent activity feed
- Applications List: full table with filters, search, sort by date/amount/status
- Application Detail: customer info, loan details, action buttons (Approve/Reject/Request Info), notes section, status history timeline

### UI/UX Design
- Professional banking aesthetic
- Color scheme: deep navy (#0F172A) + gold/amber accents (#F59E0B) + white
- Angular Material components throughout (mat-card, mat-table, mat-form-field, mat-chip, etc.)
- Tailwind CSS for layout and spacing
- Fully responsive — mobile and desktop
- Loading skeleton screens while data loads
- Toast notifications (Angular Material Snackbar) for every action
- Smooth route transition animations
- Status badges with color coding:
  Pending = yellow, UnderReview = blue, Approved = green, Rejected = red, MoreInfoRequired = orange
- Empty state with friendly message when no applications
- Confirmation dialogs before irreversible actions (reject, etc.)
- Multi-step form with progress indicator for loan application

### Security
- JWT stored in localStorage
- HTTP interceptor attaches Bearer token to all API calls
- Auth guard redirects unauthenticated users to login
- Role guard redirects users to their correct dashboard
- Logout clears token and redirects to landing page

## Running the App
Backend: cd backend && dotnet run
Frontend: cd frontend && npm install && ng serve
Backend runs on: https://localhost:5001
Frontend runs on: http://localhost:4200

## Instructions
- Build backend first, then frontend
- Make sure EF Core migrations are created and applied automatically on startup
- Make sure seeding runs automatically on startup
- Everything must work out of the box with zero manual steps beyond running the app
- Do not ask for confirmation on anything — just build it
- Use best practices, clean code, proper error handling throughout
- The UI must look exceptional — not a basic CRUD app
