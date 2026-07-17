# Banquet Management Backend Architecture

## Overview
This document describes the architecture of the Banquet Management System backend located in `backend/`.

The backend is built using Node.js and Express, with PostgreSQL as the primary relational database. It is organized into layered modules for configuration, routing, request handling, persistence, services, middleware, validation, and background jobs.

## Technology Stack
- Node.js
- Express
- PostgreSQL (`pg`)
- Redis
- JWT authentication
- Swagger UI for API documentation
- Puppeteer for PDF generation
- Multer for file uploads
- Helmet, compression, CORS, Morgan for middleware
- Jest for testing
- ESLint for linting

## High-Level Architecture

### Entry Points
- `src/server.js`
  - Loads environment variables
  - Imports and starts the Express app
  - Binds the app to `process.env.PORT` or `5000`
- `src/app.js`
  - Builds the Express application
  - Loads middleware
  - Registers API routes
  - Mounts Swagger API docs
  - Provides a health endpoint and root status route

### Request Flow
1. Client sends HTTP request to API endpoint.
2. Express routing layer matches the request path to a route in `src/routes/`.
3. A route delegates to a controller function in `src/controllers/`.
4. Controller performs request validation and business orchestration.
5. Controller invokes model or service layer functions.
6. Model layer interacts with PostgreSQL via `src/config/db.js`.
7. Response is sent back to the client.
8. If any error occurs, `src/middlewares/errorMiddleware.js` formats and returns the error.

## Directory Structure

- `src/`
  - `app.js` — Express application configuration and route mounting.
  - `server.js` — server startup.
  - `config/`
    - `db.js` — PostgreSQL connection pool.
    - `env.js` — environment variable validation using `envalid`.
    - `multer.js` — upload handling configuration.
    - `redis.js` — Redis client setup.
  - `routes/` — Express routers for each resource.
  - `controllers/` — request handlers for each route.
  - `models/` — database access layer with raw SQL queries.
  - `services/` — reusable business utilities and integrations.
  - `middlewares/` — auth, role checks, validation, and error handling.
  - `validators/` — route-specific request validation rules.
  - `docs/` — API documentation files (Swagger YAML).
  - `jobs/` — scheduled/background tasks.
  - `tests/` — automated tests.
  - `uploads/` — file storage for uploaded assets.

## Core Layers

### Configuration
- `src/config/db.js`
  - Uses `pg.Pool` to connect to PostgreSQL.
  - Exports a shared `pool` object used by models.
- `src/config/env.js`
  - Validates critical environment variables such as `PORT`, `DB_USER`, `DB_NAME`, and `JWT_SECRET`.
- `src/config/redis.js`
  - Configures Redis connection for caching or locks.

### Routing
Each resource route file exposes endpoints and maps them to controller actions.
- Example: `src/routes/venueRoutes.js`
  - `GET /api/venues` → `venueController.getVenues`
  - `POST /api/venues` → `venueController.addVenue`

Other resources include halls, bookings, availability, functions, BEOs, auth, billing, menus, layouts, approvals, reports, file uploads, and health checks.

### Controllers
Controllers handle incoming requests, assemble parameters, call model/service functions, and return JSON responses.
- Example: `src/controllers/bookingController.js`
  - `getBookings` retrieves all bookings.
  - `addBooking` creates a booking record.

### Models
The model layer encapsulates SQL operations.
- Example: `src/models/Venue.js`
  - `getAllVenues()` executes `SELECT * FROM venues`
  - `createVenue(...)` inserts a new venue row
- Example: `src/models/User.js`
  - `createUser(...)` inserts a new user
  - `getUserByEmail(...)` fetches a user by email

### Services
Services provide shared logic and integrations beyond direct database access.
- `auditService.js` — audit logging operations
- `availabilityService.js` — availability calculations and business logic
- `beoService.js` — BEO-specific operations
- `billingService.js` — billing workflows
- `lockService.js` — locking semantics, likely backed by Redis
- `notificationService.js` — notifications/email workflows
- `pdfService.js` — PDF generation using Puppeteer

### Middleware
- `authMiddleware.js` — JWT token verification and request authorization
- `roleMiddleware.js` — role-based access control (RBAC) checks
- `validationMiddleware.js` — request input validation handling
- `errorMiddleware.js` — centralized error handling and response formatting

### Validation
- `validators/authValidator.js` — uses `express-validator` to validate auth payloads.
- Additional validators likely exist for resource-specific payloads.

### Jobs
Background tasks are defined under `src/jobs/`.
- `releaseTentativeBookings.js`
  - Runs hourly via `node-cron`
  - Automatically marks tentative bookings as released if older than 48 hours

## API Documentation
- The app serves Swagger UI at `/api-docs`
- Swagger spec is loaded from `src/docs/swagger.yaml`

## Important files and behaviors
- `backend/package.json`
  - `scripts`: `dev`, `start`, `test`, `lint`
  - Main entry: `src/server.js`
- `src/app.js`
  - Adds middleware in this order: error middleware, CORS, security, compression, logger, JSON body parser.
  - Mounts all resource routes and docs.
- `src/server.js`
  - Loads `dotenv` and job scheduler before starting the app.

## Data Persistence
- PostgreSQL is used directly via raw SQL queries in the model layer.
- Entities include venues, halls, bookings, functions, BEOs, billing, users, layouts, menu items, audit logs, and versions.
- The database layer is intentionally simple and direct, without an ORM.

## Extensibility
To add a new resource:
1. Create a router in `src/routes/`
2. Create controller actions in `src/controllers/`
3. Add persistence functions in `src/models/`
4. Add any shared logic to `src/services/`
5. Add validation rules in `src/validators/`
6. Mount the router in `src/app.js`

## Deployment Notes
- Use `npm start` to launch in production.
- Use `npm run dev` with `nodemon` for local development.
- Ensure environment variables are configured for DB credentials and JWT secret.

## Summary
This backend uses a layered Express architecture with clear separation of:
- routing
- controllers
- models
- services
- middleware
- scheduled jobs

It is designed for a banquet/event management domain and keeps database access centralized in the `src/models/` layer while controllers remain focused on request/response handling.
