import { openapi } from "@elysiajs/openapi";
import { Elysia, t } from "elysia";
import type { School } from "./types";

let schools: School[] = [];
try {
  const file = Bun.file("dist/schools.min.json");
  if (await file.exists()) {
    schools = await file.json();
    console.log(`Loaded ${schools.length} schools.`);
  } else {
    console.warn(
      "dist/schools.min.json not found. Run 'bun run scrape' first.",
    );
  }
} catch (error) {
  console.error("Failed to load school data:", error);
}

const app = new Elysia()
  .use(openapi())
  .get("/", () => ({
    message: "Thai School Data API",
    endpoints: {
      schools: "/schools",
      documentation: "/openapi",
    },
  }))
  .get(
    "/schools",
    ({ query: { q, province } }) => {
      let data = schools;

      if (province) {
        data = data.filter((s) => s.province === province);
      }

      if (q) {
        data = data.filter((s) => s.name.includes(q));
      }

      return data;
    },
    {
      query: t.Object({
        q: t.Optional(t.String({ description: "Search by school name" })),
        province: t.Optional(t.String({ description: "Filter by province" })),
      }),
      detail: {
        summary: "List schools",
        description: "Get a list of schools with optional filtering",
      },
    },
  )
  .listen(3000);

export default app;
