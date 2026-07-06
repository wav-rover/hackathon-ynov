# Vet Locator Backend

Express + TypeScript API for users, pets, authentication, and nearby veterinary clinic search.

## Requirements

- Node.js 24.x
- npm
- Docker with Docker Compose
- Google API key with legacy Places API access

## Environment

Create a local env file:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hackathon_ynov?schema=public"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
```

Optional:

```env
PORT=3000
```

## Install

```bash
npm install
```

## Database

Start PostgreSQL:

```bash
npm run db:up
```

Run migrations:

```bash
npm run prisma:migrate
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

Stop PostgreSQL:

```bash
npm run db:down
```

## Run

Build and start the API:

```bash
npm start
```

Default URL:

```text
http://localhost:3000
```

Use another port:

```bash
PORT=3001 npm start
```

## API Documentation

Swagger UI:

```text
http://localhost:3000/docs
```

OpenAPI JSON:

```text
http://localhost:3000/openapi.json
```

The OpenAPI JSON can be used to generate a frontend client, for example:

```bash
npx openapi-typescript http://localhost:3000/openapi.json -o ../front/src/api/schema.d.ts
```

or with an OpenAPI client generator of your choice.

## Scripts

- `npm run build` - compile TypeScript into `dist`
- `npm start` - build and run `dist/src/index.js`
- `npm run db:up` - start PostgreSQL container
- `npm run db:down` - stop PostgreSQL container and network
- `npm run db:logs` - follow PostgreSQL logs
- `npm run prisma:migrate` - run Prisma migrations
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:studio` - open Prisma Studio

## Project Structure

```text
back/
  data/
    veterinary-clinics.csv          # local fake veterinary clinic source
  prisma/
    migrations/
    schema.prisma                   # User and Pet models
  src/
    controllers/                    # HTTP request/response handlers
    docs/
      openapi.ts                    # OpenAPI 3 specification
    errors/                         # shared HTTP errors
    middlewares/                    # auth and error middleware
    repositories/                   # Prisma, Google Places, CSV access
    routes/                         # Express routers
    services/                       # business logic
    types/                          # shared domain types
    utils/                          # helpers
    db.ts                           # Prisma client
    index.ts                        # Express app entrypoint
```

## API Overview

### Health

```http
GET /
```

Returns:

```json
{ "message": "API is running" }
```

### Auth

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

Register/login body:

```json
{
  "username": "anton",
  "password": "secret123"
}
```

Passwords must be 8 to 128 characters long. Register and login endpoints are rate-limited.

Protected routes require:

```http
Authorization: Bearer <jwt>
```

### Users

```http
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

Users can read, update, and delete only their own user by id. The API does not expose a user list endpoint.

### Pets

```http
POST /pets
GET /pets
GET /pets/:id
PUT /pets/:id
DELETE /pets/:id
```

Pets belong to the authenticated user.
`GET /pets` returns only pets owned by the current authenticated user.

Create pet body:

```json
{
  "name": "Barsik",
  "type": "cat"
}
```

### Veterinary Clinics

```http
GET /veterinary-clinics
GET /clinics/veterinary
```

The response combines:

- Google Places API results
- local CSV results from `data/veterinary-clinics.csv`

Duplicates are merged, then results are filtered, sorted, and paginated.
Clinic search is rate-limited and Google Places results are cached briefly to protect API quota.

Query params:

- `lat` or `latitude` - required user latitude
- `lng` or `longitude` - required user longitude
- `distance` - `5`, `10`, `25`, or `50` kilometers
- `openNow` - `true` or `false`
- `open24_7` - `true` or `false`
- `services` - comma-separated services, for example `consultation,vaccination`
- `emergency` - `true` or `false`
- `sort` - `nearest` or `rating`
- `page` - page number, default `1`
- `pageSize` - page size, default `10`, max `50`
- `language` - Google language code, default `fr`

Example:

```bash
curl "http://localhost:3000/veterinary-clinics?lat=48.8566&lng=2.3522&distance=5&openNow=true&emergency=true&sort=rating&page=1&pageSize=10"
```

Response shape:

```json
{
  "clinics": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "filters": {
    "distanceKm": 5,
    "openNow": true,
    "open24_7": null,
    "services": [],
    "emergency": true,
    "sort": "rating"
  },
  "sources": {
    "google": 20,
    "csv": 5,
    "merged": 2
  }
}
```

## Error Format

Most errors are returned as:

```json
{
  "message": "Invalid query parameters",
  "details": [
    {
      "field": "latitude",
      "message": "latitude must be between -90 and 90"
    }
  ]
}
```
