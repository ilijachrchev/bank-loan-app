# Bank Loan Application System

A full-stack bank loan management platform with customer-facing loan applications and a banker review dashboard.

## Tech Stack

- **Frontend**: Angular 17+ (standalone components, Angular Material, Tailwind CSS)
- **Backend**: .NET 8 Web API (C#, Clean Architecture)
- **Database**: PostgreSQL with Entity Framework Core
- **Auth**: JWT Bearer tokens + ASP.NET Core Identity
- **API Docs**: Swagger / Swashbuckle

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [PostgreSQL 14+](https://www.postgresql.org/)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

## Database Setup

Create the PostgreSQL database and user:

```sql
CREATE USER loanapp WITH PASSWORD 'loanapp123';
CREATE DATABASE loanappdb OWNER loanapp;
GRANT ALL PRIVILEGES ON DATABASE loanappdb TO loanapp;
```

## Running the Backend

```bash
cd backend
dotnet run
```

The API starts at **https://localhost:5001** (HTTP: http://localhost:5000).

- Migrations are applied automatically on startup.
- The database is seeded with demo accounts and sample data automatically.
- Swagger UI is available at: https://localhost:5001/swagger

## Running the Frontend

```bash
cd frontend
npm install
ng serve
```

The app starts at **http://localhost:4200**.

## Demo Accounts

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Customer | customer@demo.com   | Demo@1234  |
| Banker   | banker@demo.com     | Demo@1234  |

## Features

### Customer Area
- Register / Login with JWT auth
- Apply for loans (multi-step form): Personal, Home, Car, Business, Education
- View all applications with status filtering and search
- View application detail with status history timeline

### Banker Area
- Dashboard with stats (Total, Pending, Under Review, Approved, Rejected)
- Full applications list with filtering and search
- Application detail with:
  - Approve / Reject / Request More Info actions
  - Add internal notes
  - Status history timeline

## API Endpoints

### Auth
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/auth/register    | Register new user    |
| POST   | /api/auth/login       | Login                |
| POST   | /api/auth/refresh     | Refresh JWT token    |
| POST   | /api/auth/logout      | Logout               |

### Customer (requires Customer role)
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | /api/loans/my               | Get my applications       |
| POST   | /api/loans/apply            | Apply for a loan          |
| GET    | /api/loans/{id}             | Get application by ID     |
| GET    | /api/loans/{id}/history     | Get status history        |

### Banker (requires Banker role)
| Method | Endpoint                            | Description           |
|--------|-------------------------------------|-----------------------|
| GET    | /api/banker/applications            | List all applications |
| GET    | /api/banker/applications/{id}       | Get application detail|
| PUT    | /api/banker/applications/{id}/status| Update status         |
| POST   | /api/banker/applications/{id}/notes | Add note              |
| GET    | /api/banker/applications/{id}/notes | Get notes             |
| GET    | /api/banker/stats                   | Get dashboard stats   |

## Loan Statuses

| Status           | Color  | Meaning                                   |
|------------------|--------|-------------------------------------------|
| Pending          | Yellow | Submitted, awaiting review                |
| UnderReview      | Blue   | Being reviewed by banker                  |
| Approved         | Green  | Loan approved                             |
| Rejected         | Red    | Loan rejected                             |
| MoreInfoRequired | Orange | Banker requested additional information   |

## Project Structure

```
bank-loan-app/
  backend/                    # .NET 8 Web API
    Controllers/              # API controllers
    Data/                     # DbContext, DbSeeder
    DTOs/                     # Data transfer objects
    Entities/                 # EF Core entities
    Enums/                    # LoanType, LoanStatus, UserRoles
    Interfaces/               # Service interfaces
    Mappings/                 # AutoMapper profiles
    Middleware/               # Global exception handler
    Services/                 # Business logic
    Validators/               # FluentValidation validators
    Migrations/               # EF Core migrations

  frontend/                   # Angular 17+ app
    src/app/
      core/
        models/               # TypeScript interfaces
        services/             # HTTP services
        interceptors/         # JWT & error interceptors
        guards/               # Auth & role guards
      features/
        auth/                 # Login, Register
        home/                 # Landing page
        customer/             # Customer dashboard, apply loan, etc.
        banker/               # Banker dashboard, applications, etc.
        not-found/            # 404 page
      shared/
        components/           # Navbar, StatusBadge, ConfirmDialog, etc.
```
