import express from "express";

import { prisma } from "./db.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { router } from "./routes/index.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "API is running" });
});

app.use(router);
app.use(notFound);
app.use(errorHandler);

async function start() {
  await prisma.$connect();
  console.log("Connected to database");

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  server.on("error", async (error: NodeJS.ErrnoException) => {
    console.error("Failed to start HTTP server", error);
    await prisma.$disconnect();
    process.exit(1);
  });

  const shutdown = async () => {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch(async (error: unknown) => {
  console.error("Failed to start application", error);
  await prisma.$disconnect();
  process.exit(1);
});
