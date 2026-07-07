# Hackathon Ynov — Vet Locator

Hackathon project monorepo: React frontend + backend API.

## Structure

```
├── front/   → React app (Vite + shadcn/ui)
└── back/    → Backend API
```

## Quick start

**Make commands**

Linux/macOS:

```bash
make -f Makefile.linux start
make -f Makefile.linux stop

make -f Makefile.linux status
make -f Makefile.linux logs
```

Windows:

```powershell
make -f Makefile.windows start
make -f Makefile.windows stop

make -f Makefile.windows status
make -f Makefile.windows logs
```

**Infrastructure**

```bash
docker compose up -d
```

Directus CMS will be available at <http://localhost:8055>.

Default admin credentials:

```text
admin@example.com
admin
```

The `directus-seed` service creates the `brand_styles` collection with three
records: `default`, `royal-conin`, and `pedigree`. The frontend reads these
records from Directus and applies the values as CSS variables.

In Directus, edit `brand_styles` to manage brand colors, fonts, logo, and
favicon. If `logo` is empty, the frontend renders `logo_initials`; if `favicon`
is empty, the frontend keeps the default `/vite.svg` favicon.

**Frontend**

```bash
cd front
npm install
npm run dev
```

Brand URLs:

```text
http://localhost:5173/
http://localhost:5173/royal-conin
http://localhost:5173/pedigree
```

**Backend**

```bash
cd back
# configure based on chosen stack
```

## Stack

| Part  | Technologies                                                  |
| ----- | ------------------------------------------------------------- |
| Front | React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, Lucide |
| Back  | TBD                                                           |
