# Back — Vet Locator

Backend API for the project. Folder to be initialized.

## Role

Exposes endpoints consumed by the frontend (`front/`): vet data, geolocation, etc.

## Next steps

1. Choose a stack (Node/Express, NestJS, FastAPI…)
2. Initialize the project here
3. Set up the database if needed
4. Document environment variables (`.env.example`)

## Commands

```bash
# to be filled in after initialization
npm install
npm run dev
```

# Backend

Express API with Prisma and PostgreSQL.

## Requirements

- Node.js 24.x
- npm
- Docker with Docker Compose

## Setup

Install dependencies:

```bash
npm install
```

Create local environment file:

```bash
cp .env.example .env
```

Default database URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hackathon_ynov?schema=public"
```

## Database

Start PostgreSQL from the repository root compose file:

```bash
npm run db:up
```

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

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

Build the TypeScript project and start the API:

```bash
npm start
```

The server listens on:

```text
http://localhost:3000
```

Health check endpoint:

```text
GET /
```

Response:

```text
hello
```

## Scripts

- `npm run build` - compile TypeScript into `dist`
- `npm start` - build and run `dist/src/index.js`
- `npm run db:up` - start PostgreSQL container
- `npm run db:down` - stop PostgreSQL container and network
- `npm run db:logs` - follow PostgreSQL logs
- `npm run prisma:migrate` - run Prisma migrations in development
- `npm run prisma:generate` - generate Prisma Client
- `npm run prisma:studio` - open Prisma Studio

## Project Structure

```text
back/
  prisma/
    schema.prisma
  src/
    db.ts
    index.ts
  .env.example
  package.json
  prisma.config.ts
  tsconfig.json
```
