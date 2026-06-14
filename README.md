# SSH-Travel-Planner-Backend

SSH Travel Planner API

## Overview

SSH Travel Planner API është një backend RESTful i ndërtuar me NestJS, Prisma ORM dhe PostgreSQL për menaxhimin e një platforme moderne të planifikimit të udhëtimeve.

Sistemi mbështet:

- autentikim dhe autorizim me JWT
- multi-tenant architecture
- menaxhimin e destinacioneve turistike
- rezervime të hoteleve dhe fluturimeve
- pagesa online
- wishlist
- reviews
- travel packages
- notifications
- AI travel recommendations
- admin dashboard analytics
- audit logs
- background jobs

## Tech Stack

- Backend Framework: NestJS
- Language: TypeScript
- Database ORM: Prisma ORM
- Database: PostgreSQL
- Authentication: JWT + Refresh Tokens
- Queue Processing: BullMQ
- Caching / Queue Store: Redis
- Documentation: Swagger / OpenAPI 3.0

## Project Architecture

SSH Travel Planner is organized as a distributed system composed of multiple independent services. The project follows a monorepo-style structure where the frontend and backend applications are maintained separately but deployed together through Docker Compose.

### Repository Structure

```text
TravelPlanner/
│
├── docker-compose.yml
│
├── SSH-Travel-Planner-Backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   └── Dockerfile
│
└── SSH-Travel-Planner-Frontend/
    ├── src/
    └── Dockerfile
```

### System Components

The platform consists of four main services:

| Service       | Technology         | Purpose                     |
| ------------- | ------------------ | --------------------------- |
| Frontend      | React + TypeScript | User Interface              |
| Backend       | NestJS             | REST API & Business Logic   |
| Database      | PostgreSQL         | Persistent Data Storage     |
| Cache & Queue | Redis              | Caching and Background Jobs |

### Architecture Diagram

```text
┌─────────────────────┐
│      Frontend       │
│    React + Vite     │
└──────────┬──────────┘
           │ HTTP/HTTPS
           ▼
┌─────────────────────┐
│       Backend       │
│       NestJS        │
└───────┬─────┬───────┘
        │     │
        │     │
        ▼     ▼
 ┌─────────┐ ┌─────────┐
 │PostgreSQL│ │ Redis  │
 │Database │ │Cache &  │
 │         │ │Queues   │
 └─────────┘ └─────────┘
```

### Docker Deployment

All services are orchestrated using Docker Compose and connected through a dedicated bridge network.

```yaml
docker-compose.yml
```

Starting the entire platform requires a single command executed from the project root directory:

```bash
docker compose up --build
```

### Service Endpoints

| Service               | URL                       |
| --------------------- | ------------------------- |
| Frontend              | http://localhost:8080     |
| Backend API           | http://localhost:5000     |
| Swagger Documentation | http://localhost:5000/api |
| PostgreSQL            | localhost:5432            |
| Redis                 | localhost:6379            |

### Infrastructure Responsibilities

#### PostgreSQL

Stores all application data including:

- Users
- Tenants
- Destinations
- Hotels
- Rooms
- Flights
- Bookings
- Payments
- Reviews
- Travel Packages

#### Redis

Used for:

- API response caching
- BullMQ queue storage
- Background job processing
- Performance optimization
- AI task execution

#### NestJS Backend

Responsible for:

- REST API endpoints
- Authentication & Authorization
- Business logic
- Multi-tenancy
- OpenAI integration
- Database access
- Queue management

#### React Frontend

Responsible for:

- User interface
- State management
- API communication
- Authentication flow
- Dashboard visualization

### Network Communication

All services communicate through the internal Docker network:

```text
travel-network
```

This architecture follows the Distributed Systems principles of service separation, network-based communication, scalability, maintainability, and modular deployment.

## Project Structure

```text
src/
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   └── services/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tenants/
│   ├── destinations/
│   ├── hotels/
│   ├── airports/
│   ├── airlines/
│   ├── flights/
│   ├── rooms/
│   ├── bookings/
│   ├── booking-items/
│   ├── payments/
│   ├── reviews/
│   ├── wishlists/
│   ├── coupons/
│   ├── notifications/
│   ├── travel-packages/
│   ├── activities/
│   ├── tenant-settings/
│   ├── audit-logs/
│   ├── background-jobs/
│   ├── ai/
│   └── admin/
│
├── app.module.ts
├── app.controller.ts
└── main.ts
```

## Features

- Authentication & Authorization
- User registration
- User login
- Logout
- Refresh access token
- JWT authentication
- Role-based authorization
- Route protection with Guards
- Multi-Tenant Architecture

Platforma është ndërtuar me multi-tenant architecture, ku çdo tenant ka:

- users të vet
- destinations të veta
- hotels të veta
- bookings të veta
- settings të veta

Tenant identifikohet përmes middleware dhe guards.

## Core Modules

### Auth Module

Menaxhon:

- Register
- Login
- Logout
- Refresh Token
- Current User Profile

### Users Module

Menaxhon:

- CRUD për users
- profile management
- role assignment
- reviews by user

### Destinations Module

Menaxhon:

- krijimin e destinacioneve
- listimin e tyre
- update/delete
- lidhjen me hotele dhe fluturime

### Hotels Module

Menaxhon:

- hotel CRUD
- hotel listing sipas destination
- rooms për secilin hotel

### Flights Module

Menaxhon:

- flight creation
- departures
- arrivals
- airline relationship
- airport relationship

### Rooms Module

Menaxhon:

- room inventory
- room types
- pricing
- availability

### Bookings Module

Menaxhon:

- booking creation
- booking items
- booking cancellation
- booking history
- payment association

### Payments Module

Menaxhon:

- payment processing
- payment status
- booking payment records

### Reviews Module

Menaxhon:

- review creation
- update
- delete
- user reviews

### Wishlist Module

Lejon përdoruesit të:

- ruajnë destinacione favorite
- largojnë destinacione nga wishlist

### Coupons Module

Mbështet:

- coupon creation
- discount management
- promotional campaigns

### Notifications Module

Përdoret për:

- booking notifications
- payment alerts
- user activity notifications
- mark as read functionality

### Travel Packages Module

Mbështet:

- package creation
- adding hotels
- adding flights
- package customization

### AI Recommendations Module

Integrim me AI për të gjeneruar:

- travel suggestions
- destination recommendations
- personalized trip ideas

Endpoint:

- `POST /ai/recommendations`

### Admin Module

Dashboard analytics për administratorët:

- platform statistics
- tenant statistics
- booking trends
- global analytics

### Audit Logs Module

Regjistron:

- create actions
- update actions
- delete actions
- system activity history

### Background Jobs

Përdor BullMQ + Redis për:

- email jobs
- booking processing
- failed job tracking
- cron tasks

## API Documentation

Swagger UI gjendet në:

- `/api`

Përmes Swagger mund të:

- testosh endpoints
- autorizohesh me JWT
- shikosh request/response schemas

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Krijo .env file:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/travel_planner
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Database Setup

#### Prisma Migration

```bash
npx prisma migrate dev
```

#### Generate Prisma Client

```bash
npx prisma generate
```

### Run Application

#### Development

```bash
npm run start:dev
```

#### Production

```bash
npm run build
npm run start:prod
```

## Testing

### Unit Tests

```bash
npm run test
```

### e2e Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

## Security

Sistemi përfshin:

- JWT Authentication
- Refresh Tokens
- Role Guards
- Tenant Guards
- Request Logging Middleware
- Rate Limiting Middleware
- Authorization Decorators
- Protected Routes

## Future Improvements

- Stripe payment integration
- Email verification
- Forgot password flow
- Real-time notifications via WebSockets
- Flight API integrations
- Hotel availability synchronization
- Recommendation engine improvements
- Mobile app support

## Author

Leonita Rama

Liridona Kurrumeli
