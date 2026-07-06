# Front — Vet Locator

React app with **shadcn/ui**, **Tailwind CSS 4**, and **Vite**.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- shadcn/ui (`base-mira` style)
- Lucide React (icons)
- Built-in dark mode (press `d` to toggle)

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
npm run format   # Prettier
```

## Add a shadcn component

```bash
npx shadcn@latest add <component>
```

UI components live in `src/components/ui/`.

## Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   └── theme-provider.tsx
├── lib/utils.ts         # cn() utility
├── App.tsx
└── main.tsx
```
