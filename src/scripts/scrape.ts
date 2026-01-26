import { mkdir } from "node:fs/promises";
import { provinces } from "../constants/provinces";
import { getList } from "../services/scraper";
import type { School } from "../types";

const main = async () => {
  console.log("Starting to scrap schools...");

  const allSchools: School[] = [];

  await mkdir("dist/provinces", { recursive: true });

  for (const province of provinces) {
    try {
      console.log(`Scraping ${province}...`);
      const schools = await getList(province);
      allSchools.push(...schools);
      // Pretty print
      await Bun.write(
        `dist/provinces/${province}.json`,
        JSON.stringify(schools, null, 2),
      );
      // Minified
      await Bun.write(
        `dist/provinces/${province}.min.json`,
        JSON.stringify(schools),
      );
      console.log(`Fetched ${schools.length} schools for ${province}`);
    } catch (error) {
      console.error(`Failed to scrap ${province}:`, error);
    }
  }

  // Pretty print
  await Bun.write(`dist/schools.json`, JSON.stringify(allSchools, null, 2));
  // Minified
  await Bun.write(`dist/schools.min.json`, JSON.stringify(allSchools));
  console.log(
    `Completed. Saved ${allSchools.length} schools to dist/schools.json and dist/schools.min.json`,
  );
};

main();
