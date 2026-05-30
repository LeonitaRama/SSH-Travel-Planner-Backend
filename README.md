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

ose

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
