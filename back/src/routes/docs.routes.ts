import { Router } from "express";
import * as swaggerUi from "swagger-ui-express";

import { openApiDocument } from "../docs/openapi.js";

export const docsRouter = Router();

docsRouter.get("/openapi.json", (_request, response) => {
  response.json(openApiDocument);
});

docsRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);
