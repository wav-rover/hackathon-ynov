const directusUrl = process.env.DIRECTUS_URL ?? "http://directus:8055";
const adminEmail = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.DIRECTUS_ADMIN_PASSWORD ?? "admin";

const collection = "brand_styles";

function getColorFieldMeta(note = "CSS color value.") {
  return {
    interface: "select-color",
    width: "half",
    note,
  };
}

const fields = [
  {
    field: "id",
    type: "integer",
    meta: { hidden: true, interface: "input" },
    schema: {
      is_primary_key: true,
      has_auto_increment: true,
      is_nullable: false,
    },
  },
  {
    field: "slug",
    type: "string",
    meta: {
      interface: "input",
      required: true,
      width: "half",
      note: "URL prefix, for example royal-conin or pedigree.",
    },
    schema: { is_nullable: false, is_unique: true },
  },
  {
    field: "name",
    type: "string",
    meta: { interface: "input", required: true, width: "half" },
    schema: { is_nullable: false },
  },
  {
    field: "logo_initials",
    type: "string",
    meta: { interface: "input", width: "half" },
  },
  {
    field: "logo",
    type: "uuid",
    meta: {
      interface: "file-image",
      display: "image",
      special: ["file"],
      width: "half",
      note: "Optional brand logo. If empty, the frontend uses logo initials.",
    },
    schema: {
      is_nullable: true,
      foreign_key_table: "directus_files",
      foreign_key_column: "id",
    },
  },
  {
    field: "favicon",
    type: "uuid",
    meta: {
      interface: "file-image",
      display: "image",
      special: ["file"],
      width: "half",
      note: "Optional browser favicon. If empty, the frontend uses /vite.svg.",
    },
    schema: {
      is_nullable: true,
      foreign_key_table: "directus_files",
      foreign_key_column: "id",
    },
  },
  {
    field: "tagline",
    type: "string",
    meta: { interface: "input", width: "half" },
  },
  {
    field: "font_sans",
    type: "string",
    meta: { interface: "input", width: "half" },
  },
  {
    field: "font_heading",
    type: "string",
    meta: { interface: "input", width: "half" },
  },
  {
    field: "primary_color",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "primary_foreground",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "background",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "foreground",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "secondary",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "secondary_foreground",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "muted",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "muted_foreground",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "accent",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "accent_foreground",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "border_color",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "input_color",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "ring",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "sidebar_primary",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "map_user_marker_fill",
    type: "string",
    meta: getColorFieldMeta(),
  },
  {
    field: "map_user_marker_stroke",
    type: "string",
    meta: getColorFieldMeta(),
  },
];

const brands = [
  {
    slug: "default",
    name: "ROYAL CANIN",
    logo_initials: "RC",
    tagline: "VET LOCATOR",
    font_sans: "'Inter Variable', sans-serif",
    font_heading: "'Inter Variable', sans-serif",
    primary_color: "#C80F2E",
    primary_foreground: "oklch(0.971 0.013 17.38)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    secondary: "oklch(0.967 0.001 286.375)",
    secondary_foreground: "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.97 0 0)",
    muted_foreground: "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    accent_foreground: "oklch(0.205 0 0)",
    border_color: "oklch(0.922 0 0)",
    input_color: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    sidebar_primary: "#C80F2E",
    map_user_marker_fill: "#2563eb",
    map_user_marker_stroke: "#ffffff",
  },
  {
    slug: "royal-conin",
    name: "ROYAL CANIN",
    logo_initials: "RC",
    tagline: "VET LOCATOR",
    font_sans: "'Inter Variable', Arial, sans-serif",
    font_heading: "'Inter Variable', Arial, sans-serif",
    primary_color: "#E4002B",
    primary_foreground: "#ffffff",
    background: "#ffffff",
    foreground: "#171717",
    secondary: "#F4F1EC",
    secondary_foreground: "#231F20",
    muted: "#F7F4F0",
    muted_foreground: "#655F58",
    accent: "#003A70",
    accent_foreground: "#ffffff",
    border_color: "#E4DDD6",
    input_color: "#EDE7E0",
    ring: "#E4002B",
    sidebar_primary: "#E4002B",
    map_user_marker_fill: "#003A70",
    map_user_marker_stroke: "#ffffff",
  },
  {
    slug: "pedigree",
    name: "PEDIGREE",
    logo_initials: "PG",
    tagline: "VET LOCATOR",
    font_sans: "'Inter Variable', Arial, sans-serif",
    font_heading: "'Inter Variable', Arial, sans-serif",
    primary_color: "#FFD100",
    primary_foreground: "#1B2A57",
    background: "#FFFDF5",
    foreground: "#1F2933",
    secondary: "#E21A23",
    secondary_foreground: "#ffffff",
    muted: "#FFF3BF",
    muted_foreground: "#5E4B00",
    accent: "#0046AD",
    accent_foreground: "#ffffff",
    border_color: "#E9D372",
    input_color: "#FFF8D6",
    ring: "#0046AD",
    sidebar_primary: "#FFD100",
    map_user_marker_fill: "#0046AD",
    map_user_marker_stroke: "#ffffff",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${options.method ?? "GET"} ${path} failed: ${response.status} ${body}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function waitForDirectus() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const response = await fetch(`${directusUrl}/server/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting while Directus starts.
    }

    await sleep(1000);
  }

  throw new Error("Directus did not become ready in time.");
}

async function login() {
  const result = await request("/auth/login", {
    method: "POST",
    body: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  return result.data.access_token;
}

async function ensureCollection(token) {
  const existing = await fetch(`${directusUrl}/collections/${collection}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (existing.ok) {
    await ensureFields(token);
    return;
  }

  await request("/collections", {
    method: "POST",
    token,
    body: {
      collection,
      meta: {
        icon: "palette",
        note: "Brand design tokens consumed by the frontend.",
        display_template: "{{name}} ({{slug}})",
      },
      schema: { name: collection },
      fields,
    },
  });
}

async function ensureFields(token) {
  const existing = await request(`/fields/${collection}`, { token });
  const existingFieldNames = new Set(existing.data.map((field) => field.field));

  for (const [index, field] of fields.entries()) {
    const fieldWithSort = {
      ...field,
      meta: {
        ...field.meta,
        sort: index + 1,
      },
    };

    if (existingFieldNames.has(field.field)) {
      continue;
    }

    await request(`/fields/${collection}`, {
      method: "POST",
      token,
      body: fieldWithSort,
    });
  }

  for (const [index, field] of fields.entries()) {
    if (!existingFieldNames.has(field.field)) {
      continue;
    }

    await request(`/fields/${collection}/${field.field}`, {
      method: "PATCH",
      token,
      body: {
        meta: {
          ...field.meta,
          sort: index + 1,
        },
      },
    });
  }
}

async function ensureFileRelation(token, field) {
  const existing = await request(`/relations/${collection}`, { token });
  const hasRelation = existing.data.some((relation) => {
    const manyField = relation.field ?? relation.many_field;
    return manyField === field;
  });

  if (hasRelation) {
    return;
  }

  await request("/relations", {
    method: "POST",
    token,
    body: {
      collection,
      field,
      related_collection: "directus_files",
      schema: {
        on_delete: "SET NULL",
      },
      meta: {
        one_deselect_action: "nullify",
      },
    },
  });
}

async function ensureFileRelations(token) {
  await ensureFileRelation(token, "logo");
  await ensureFileRelation(token, "favicon");
}

async function ensurePublicReadPermission(token, targetCollection) {
  const existing = await request(
    `/permissions?filter[collection][_eq]=${targetCollection}&filter[action][_eq]=read`,
    { token },
  );

  if (existing.data.length > 0) {
    return;
  }

  await request("/permissions", {
    method: "POST",
    token,
    body: {
      collection: targetCollection,
      action: "read",
      role: null,
      permissions: {},
      validation: {},
      presets: {},
      fields: ["*"],
    },
  });
}

async function upsertBrands(token) {
  for (const brand of brands) {
    const existing = await request(
      `/items/${collection}?filter[slug][_eq]=${encodeURIComponent(brand.slug)}&limit=1`,
      { token },
    );

    if (existing.data.length > 0) {
      await request(`/items/${collection}/${existing.data[0].id}`, {
        method: "PATCH",
        token,
        body: brand,
      });
      continue;
    }

    await request(`/items/${collection}`, {
      method: "POST",
      token,
      body: brand,
    });
  }
}

await waitForDirectus();
const token = await login();
await ensureCollection(token);
await ensureFileRelations(token);
await ensurePublicReadPermission(token, collection);
await ensurePublicReadPermission(token, "directus_files");
await upsertBrands(token);

console.log("Directus brand styles are ready.");
