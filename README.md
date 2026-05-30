SSH Travel Planner Backend
Platformë Enterprise për Menaxhimin e Udhëtimeve Multi-Tenant
Përmbledhje e Projektit

SSH Travel Planner Backend është një RESTful API e zhvilluar me NestJS për menaxhimin e rezervimeve turistike në një mjedis Multi-Tenant Software-as-a-Service (SaaS). Sistemi ofron funksionalitete për menaxhimin e destinacioneve, hoteleve, dhomave, fluturimeve, rezervimeve, pagesave, njoftimeve, paketave turistike dhe integrimin me inteligjencën artificiale përmes OpenAI API.

Projekti është realizuar duke ndjekur parimet e arkitekturës klient-server, RESTful API Design, Role-Based Access Control (RBAC), Multi-Tenancy dhe arkitekturës së sistemeve të shpërndara.

Veçoritë Kryesore
Arkitekturë Multi-Tenant
JWT Authentication & Refresh Tokens
Role-Based Access Control (RBAC)
Menaxhimi i përdoruesve
Menaxhimi i destinacioneve
Menaxhimi i hoteleve & dhomave
Menaxhimi i fluturimeve
Menaxhimi i rezervimeve
Përpunimi i pagesave
Menaxhimi i paketave turistike
Wishlist (lista e dëshirave)
Sistemi i vlerësimeve dhe review
Menaxhimi i njoftimeve
Asistent AI për udhëtime
Audit Logging
Gjurmimi i email-eve
Përpunimi i background jobs
Redis caching
BullMQ Queue Processing
Dokumentim me Swagger
Teknologjitë e Përdorura
Backend Framework
NestJS 11
TypeScript
Shtresa e Bazës së të Dhënave
PostgreSQL
Prisma ORM
Autentikimi & Siguria
JWT
Passport
Bcrypt
Përpunimi në Background
Redis
BullMQ
Bull
Inteligjenca Artificiale
OpenAI API
Dokumentimi
Swagger
Arkitektura e Sistemit
+----------------------+
| Aplikacioni Klient |
+----------+-----------+
|
v
+----------------------+
| NestJS API |
+----------+-----------+
|
+-----+-----+
| |
v v
+---------+ +-----------+
| Prisma | | OpenAI API|
| ORM | +-----------+
+----+----+
|
v
+----------------------+
| PostgreSQL |
+----------------------+

+----------------------+
| Redis + BullMQ |
| (Caching & Queues) |
+----------------------+
Rolet e Përdoruesve
CUSTOMER
Shfleton destinacionet
Krijon rezervime
Menaxhon wishlist
Dërgon review
Përdor asistentin AI
STAFF
Menaxhon rezervimet
Menaxhon hotelet
Menaxhon fluturimet
ADMIN
Menaxhon burimet e tenant-it
Menaxhon përdoruesit
Konfiguron sistemin e tenant-it
SUPER_ADMIN
Administrim global i sistemit
Menaxhim i tenantëve
Modelet e Bazës së të Dhënave

Sistemi përdor PostgreSQL dhe Prisma ORM.

Entitetet Kryesore
Tenant
TenantSettings
User
RefreshToken
Destination
Hotel
Room
Flight
Booking
BookingItem
Payment
Review
Wishlist
Notification
TravelPackage
Activity
Airline
Airport
Coupon
AiChat
AuditLog
BackgroundJob
EmailLog
BookingConfirmation
WebhookEvent
Konfigurimi i Mjedisit

Krijo një file .env në root të projektit.

DATABASE_URL=<url_e_bazes_se_te_dhenave>

JWT_SECRET=<sekreti_jwt>

OPENAI_API_KEY=<çelesi_openai_api>

PORT=3000
Instalimi
Klono Repository-in
git clone <repository-url>

cd SSH-Travel-Planner-Backend
Instalimi i dependencies
npm install
Gjenerimi i Prisma Client
npm run prisma:generate


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

  
Migrimi i databazës
npx prisma migrate dev --name init
Seed i databazës
npm run prisma:seed
Nisja e serverit (development)
npm run start:dev
Të dhënat fillestare (Seed) dhe llogaritë testuese

Pas ekzekutimit:

npm run prisma:seed

sistemi krijon automatikisht të dhëna testuese.

Tenant Default
Vetia Vlera
Emri Default Travel Agency
Slug tenant1
Llogaritë testuese
Roli Email Fjalëkalimi
SUPER_ADMIN admin@travel.com admin123
ADMIN tenant-admin@travel.com admin123
STAFF staff@travel.com test123
CUSTOMER customer@travel.com test123
Përmbledhje e Seed
1 Tenant i krijuar
1 Super Admin
1 Tenant Admin
1 Staff user
1 Customer user

Këto llogari përdoren vetëm për testim dhe zhvillim.

Skriptet e disponueshme
Komandat e aplikacionit
npm run start
npm run start:dev
npm run start:debug
npm run build
npm run start:prod
Komandat e Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:reset
Prisma Studio
npx prisma studio
Testimet
npm test
npm run test:watch
npm run test:cov
npm run test:e2e
Shërbimet e nevojshme
Shërbimi Porta
Backend API 3000
PostgreSQL 5432
Redis 6379
Konfigurimi i Redis

BullMQ dhe caching kërkojnë Redis.

Kontrollo nëse Redis është aktiv:

redis-cli ping

Pritet përgjigjja:

PONG

Nëse Redis nuk është aktiv, background jobs dhe caching nuk do të funksionojnë si duhet.

Moduli i Inteligjencës Artificiale

Sistemi integron OpenAI API për:

Rekomandime të personalizuara udhëtimesh
Sugjerime destinacionesh
Analizë review-sh
Planifikim inteligjent udhëtimi
Asistent AI
Shembull Endpoint
POST /ai/chat
Shembull kërkese
{
"message": "Sugjero një udhëtim 7-ditor në Itali"
}
Dokumentimi i API

Dokumentimi Swagger gjenerohet automatikisht dhe është i disponueshëm pas nisjes së serverit.

http://localhost:3000/api

Përfshin:

Endpointet e disponueshme
Modelet e kërkesave
Modelet e përgjigjeve
Kërkesat për autentikim
DTO schemas

Struktura e Projektit
SSH-Travel-Planner-Backend
│
├── prisma/
│ ├── schema.prisma
│ └── seed.js
│
├── src/
│ ├── auth/
│ ├── users/
│ ├── tenants/
│ ├── destinations/
│ ├── hotels/
│ ├── rooms/
│ ├── flights/
│ ├── bookings/
│ ├── payments/
│ ├── reviews/
│ ├── wishlist/
│ ├── notifications/
│ ├── travel-packages/
│ ├── ai/
│ ├── email/
│ ├── jobs/
│ ├── common/
│ └── main.ts
│
├── test/
├── package.json
├── tsconfig.json
└── README.md

Siguria
JWT Authentication
Refresh Token Mechanism
Hashim i fjalëkalimeve me Bcrypt
Autorizim sipas roleve (RBAC)
Validim i kërkesave
Izolim i të dhënave sipas tenant-it
Mbrojtje e variablave të mjedisit
Audit Logging
Konteksti Akademik

Lënda: Sistemet e Shpërndara

Projekti: SSH Travel Planner Platform

Arkitektura: Sistem RESTful Multi-Tenant Klient-Server

Teknologjitë: NestJS, Prisma ORM, PostgreSQL, Redis, BullMQ, OpenAI API

Autorët

Leonita Rama
Liridona Kurrumeli

Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike (FIEK)

Universiteti i Prishtinës "Hasan Prishtina"

Viti akademik 2025/2026

Licenca

Ky projekt është zhvilluar për qëllime edukative dhe akademike.
=======
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
Developed as part of the SSH Travel Planner project.

Backend implemented using:
- NestJS
- Prisma ORM
- PostgreSQL

