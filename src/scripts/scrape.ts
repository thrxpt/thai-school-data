import { mkdir } from "node:fs/promises";
import { json2csv } from "json-2-csv";
import { provinces } from "../constants/provinces";
import { getList } from "../services/scraper";
import type { School } from "../types";

const main = async () => {
  console.log("Starting to scrap schools...");

  const allSchools: School[] = [];

  await mkdir("dist/json/provinces", { recursive: true });
  await mkdir("dist/csv/provinces", { recursive: true });

  for (const province of provinces) {
    try {
      console.log(`Scraping ${province}...`);
      const schools = await getList(province);
      allSchools.push(...schools);
      // Pretty print
      await Bun.write(
        `dist/json/provinces/${province}.json`,
        JSON.stringify(schools, null, 2),
      );
      // Minified
      await Bun.write(
        `dist/json/provinces/${province}.min.json`,
        JSON.stringify(schools),
      );
      // CSV
      await Bun.write(`dist/csv/provinces/${province}.csv`, json2csv(schools));
      console.log(`Fetched ${schools.length} schools for ${province}`);
    } catch (error) {
      console.error(`Failed to scrap ${province}:`, error);
    }
  }

  // Pretty print
  await Bun.write(
    `dist/json/schools.json`,
    JSON.stringify(allSchools, null, 2),
  );
  // Minified
  await Bun.write(`dist/json/schools.min.json`, JSON.stringify(allSchools));
  // CSV
  await Bun.write(`dist/csv/schools.csv`, json2csv(allSchools));
  console.log(
    `Completed. Saved ${allSchools.length} schools to dist/json/* and dist/csv/*`,
  );
};

main();
