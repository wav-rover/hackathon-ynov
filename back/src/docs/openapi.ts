export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Vet Locator API",
    version: "1.0.0",
    description:
      "Backend API for authentication, users, pets, and nearby veterinary clinics.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Pets" },
    { name: "Veterinary clinics" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid query parameters" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "latitude" },
                message: { type: "string", example: "latitude must be a number" },
              },
            },
          },
        },
        required: ["message"],
      },
      AuthCredentials: {
        type: "object",
        properties: {
          username: { type: "string", example: "anton" },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 128,
            example: "secret123",
          },
        },
        required: ["username", "password"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "anton" },
          pets: {
            type: "array",
            items: { $ref: "#/components/schemas/Pet" },
          },
        },
        required: ["id", "username"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["token", "user"],
      },
      CreatePetRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Barsik" },
          type: { type: "string", example: "cat" },
        },
        required: ["name", "type"],
      },
      UpdatePetRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Marsik" },
          type: { type: "string", example: "dog" },
        },
      },
      Pet: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Barsik" },
          type: { type: "string", example: "cat" },
          userId: { type: "integer", example: 1 },
        },
        required: ["id", "name", "type", "userId"],
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          username: { type: "string", example: "anton_new" },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 128,
            example: "new-secret123",
          },
        },
      },
      ClinicIcon: {
        type: "object",
        properties: {
          url: {
            type: "string",
            nullable: true,
            example:
              "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
          },
          backgroundColor: { type: "string", nullable: true, example: "#7B9EB0" },
          maskBaseUri: {
            type: "string",
            nullable: true,
            example: "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
          },
        },
        required: ["url", "backgroundColor", "maskBaseUri"],
      },
      ClinicLocation: {
        type: "object",
        properties: {
          lat: { type: "number", example: 48.8566 },
          lng: { type: "number", example: 2.3522 },
        },
        required: ["lat", "lng"],
      },
      VeterinaryClinic: {
        type: "object",
        properties: {
          id: { type: "string", example: "ChIJ_VVBcBtu5kcRex3O07t5U0s" },
          name: { type: "string", nullable: true, example: "Clinique Veterinaire" },
          isOperational: { type: "boolean", example: true },
          isOpenNow: { type: "boolean", nullable: true, example: true },
          isOpen24_7: { type: "boolean", nullable: true, example: false },
          rating: { type: "number", nullable: true, example: 4.5 },
          userRatingsTotal: { type: "integer", nullable: true, example: 114 },
          phone: { type: "string", nullable: true, example: "+33 1 42 74 81 13" },
          address: {
            type: "string",
            nullable: true,
            example: "26 Rue Beaubourg, 75003 Paris, France",
          },
          website: { type: "string", nullable: true, example: "https://example.com" },
          googleMapsUrl: {
            type: "string",
            nullable: true,
            example: "https://maps.google.com/?cid=5427815823530925435",
          },
          location: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/ClinicLocation" }],
          },
          distanceMeters: { type: "integer", nullable: true, example: 1303 },
          icon: { $ref: "#/components/schemas/ClinicIcon" },
          services: {
            type: "array",
            items: { type: "string" },
            example: ["consultation", "vaccination", "emergency"],
          },
          isEmergency: { type: "boolean", example: true },
          types: {
            type: "array",
            items: { type: "string" },
            example: ["veterinary_care", "health"],
          },
          sources: {
            type: "array",
            items: { type: "string", enum: ["google", "csv"] },
            example: ["google", "csv"],
          },
        },
        required: [
          "id",
          "name",
          "isOperational",
          "isOpenNow",
          "isOpen24_7",
          "rating",
          "userRatingsTotal",
          "phone",
          "address",
          "website",
          "googleMapsUrl",
          "location",
          "distanceMeters",
          "icon",
          "services",
          "isEmergency",
          "types",
          "sources",
        ],
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          pageSize: { type: "integer", example: 10 },
          total: { type: "integer", example: 25 },
          totalPages: { type: "integer", example: 3 },
          hasNextPage: { type: "boolean", example: true },
          hasPreviousPage: { type: "boolean", example: false },
        },
        required: ["page", "pageSize", "total", "totalPages", "hasNextPage", "hasPreviousPage"],
      },
      VeterinaryClinicListResponse: {
        type: "object",
        properties: {
          clinics: {
            type: "array",
            items: { $ref: "#/components/schemas/VeterinaryClinic" },
          },
          pagination: { $ref: "#/components/schemas/Pagination" },
          filters: {
            type: "object",
            properties: {
              distanceKm: { type: "integer", enum: [5, 10, 25, 50], example: 5 },
              openNow: { type: "boolean", nullable: true, example: true },
              open24_7: { type: "boolean", nullable: true, example: null },
              services: {
                type: "array",
                items: { type: "string" },
                example: ["consultation"],
              },
              emergency: { type: "boolean", nullable: true, example: false },
              sort: { type: "string", enum: ["nearest", "rating"], example: "nearest" },
            },
          },
          sources: {
            type: "object",
            properties: {
              google: { type: "integer", example: 20 },
              csv: { type: "integer", example: 5 },
              merged: { type: "integer", example: 25 },
            },
            required: ["google", "csv", "merged"],
          },
        },
        required: ["clinics", "pagination", "filters", "sources"],
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "API is running" },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthCredentials" },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "409": { $ref: "#/components/responses/Conflict" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthCredentials" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login succeeded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get own user by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "User",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update own user",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete own user",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Deleted user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/pets": {
      get: {
        tags: ["Pets"],
        summary: "List own pets",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Pets",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Pet" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Pets"],
        summary: "Create a pet for the authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePetRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created pet",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/pets/{id}": {
      get: {
        tags: ["Pets"],
        summary: "Get own pet by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Pet",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Pets"],
        summary: "Update own pet",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePetRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated pet",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Pets"],
        summary: "Delete own pet",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "200": {
            description: "Deleted pet",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pet" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/veterinary-clinics": {
      get: {
        tags: ["Veterinary clinics"],
        summary: "Search nearby veterinary clinics",
        description:
          "Returns clinics from Google Places and local CSV data in one paginated response. Duplicate clinics are merged.",
        parameters: [
          {
            name: "latitude",
            in: "query",
            schema: { type: "number", minimum: -90, maximum: 90 },
            required: false,
            example: 48.8566,
            description: "User latitude. Alias: lat.",
          },
          {
            name: "longitude",
            in: "query",
            schema: { type: "number", minimum: -180, maximum: 180 },
            required: false,
            example: 2.3522,
            description: "User longitude. Alias: lng.",
          },
          {
            name: "lat",
            in: "query",
            schema: { type: "number", minimum: -90, maximum: 90 },
            required: false,
            example: 48.8566,
          },
          {
            name: "lng",
            in: "query",
            schema: { type: "number", minimum: -180, maximum: 180 },
            required: false,
            example: 2.3522,
          },
          {
            name: "distance",
            in: "query",
            schema: { type: "integer", enum: [5, 10, 25, 50], default: 5 },
            example: 5,
            description: "Search distance in kilometers.",
          },
          {
            name: "openNow",
            in: "query",
            schema: { type: "boolean" },
            example: true,
          },
          {
            name: "open24_7",
            in: "query",
            schema: { type: "boolean" },
            example: false,
          },
          {
            name: "services",
            in: "query",
            schema: {
              type: "string",
              example: "consultation,vaccination,emergency",
            },
            description: "Comma-separated services. Repeated service parameters are also accepted.",
          },
          {
            name: "emergency",
            in: "query",
            schema: { type: "boolean" },
            example: true,
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["nearest", "rating"], default: "nearest" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
          },
          {
            name: "language",
            in: "query",
            schema: { type: "string", default: "fr", example: "fr" },
          },
        ],
        responses: {
          "200": {
            description: "Nearby clinics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VeterinaryClinicListResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "502": {
            description: "Google Places error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/clinics/veterinary": {
      get: {
        tags: ["Veterinary clinics"],
        summary: "Alias for /veterinary-clinics",
        parameters: [
          { name: "lat", in: "query", schema: { type: "number" }, example: 48.8566 },
          { name: "lng", in: "query", schema: { type: "number" }, example: 2.3522 },
          {
            name: "distance",
            in: "query",
            schema: { type: "integer", enum: [5, 10, 25, 50] },
            example: 5,
          },
        ],
        responses: {
          "200": {
            description: "Nearby clinics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VeterinaryClinicListResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
  },
} as const;

Object.assign(openApiDocument.components, {
  parameters: {
    IdPath: {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "integer", minimum: 1 },
      example: 1,
    },
  },
  responses: {
    BadRequest: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    Unauthorized: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    Forbidden: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    NotFound: {
      description: "Not found",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    Conflict: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    TooManyRequests: {
      description: "Too many requests",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
});
