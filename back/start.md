# Start Backend On A New Device

## 1. Install dependencies

```bash
cd back
npm install
```

## 2. Create env file

```bash
cp .env.example .env
```

Fill `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hackathon_ynov?schema=public"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
```

## 3. Start database

```bash
npm run db:up
```

## 4. Apply Prisma migrations

```bash
npm run prisma:migrate
```

## 5. Generate Prisma client

```bash
npm run prisma:generate
```

## 6. Start backend

```bash
npm start
```

API:

```text
http://localhost:3000
```

Docs:

```text
http://localhost:3000/docs
```

OpenAPI JSON:

```text
http://localhost:3000/openapi.json
```
