import { load } from "cheerio";
import { provinces } from "../constants/provinces";
import type { Province, School } from "../types";

export const getList = async (province: Province) => {
  const base = "https://th.wikipedia.org/wiki/รายชื่อโรงเรียนใน";
  let url = `${base}จังหวัด${province}`;
  if (province === "กรุงเทพมหานคร") {
    url = `${base}กรุงเทพมหานคร`;
  }

  const $ = load(await fetch(encodeURI(url)).then((o) => o.text()));

  const res: School[] = [];

  $("table.wikitable").each((_, table) => {
    const $table = $(table);
    const headers = $table
      .find("th")
      .map((_, el) => $(el).text().trim())
      .get();

    if (headers.indexOf("โรงเรียน") === -1) return;

    let fallbackDistrict = "";

    let curr = $table;
    while (curr.length && curr.prop("tagName") !== "BODY") {
      const prevs = curr.prevAll();
      let foundMatch = false;

      prevs.each((_, el) => {
        const $el = $(el);
        let candidates = $el.find("h3");
        if ($el.is("h3")) candidates = $el;
        else if (candidates.length === 0) return;

        const candidate = candidates.last();
        const text = candidate
          .text()
          .replace(/\[.*?\]/g, "")
          .trim();

        if (text.startsWith("อำเภอ")) {
          fallbackDistrict = text.substring(5).trim();
          foundMatch = true;
          return false;
        }
      });

      if (foundMatch) break;
      curr = curr.parent();
    }

    const skips = new Array(headers.length).fill(0);
    const lastValues = new Array(headers.length).fill("");

    $table.find("tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      let cellIndex = 0;
      const rowData: string[] = [];

      for (let col = 0; col < headers.length; col++) {
        if (skips[col] > 0) {
          skips[col]--;
          rowData[col] = lastValues[col];
        } else {
          const cell = tds.eq(cellIndex);
          if (cell.length) {
            const text = cell
              .text()
              .replace(/\[.*?\]/g, "")
              .trim();
            const rowspan = parseInt(cell.attr("rowspan") || "1", 10);
            if (rowspan > 1) {
              skips[col] = rowspan - 1;
            }
            lastValues[col] = text;
            rowData[col] = text;
            cellIndex++;
          } else {
            rowData[col] = "";
          }
        }
      }

      const name = rowData[headers.indexOf("โรงเรียน")];
      const subDistrict =
        rowData[headers.indexOf(province === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล")];
      const district =
        rowData[
          headers.indexOf(province === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ")
        ] || fallbackDistrict;
      const level = rowData[headers.indexOf("ระดับชั้น")];

      if (!name) return;

      const addSpaceBetweenThaiAndBracket = (text: string) => {
        return text.replace(/([\u0E00-\u0E7F])([([{])/g, "$1 $2");
      };

      if (
        Array.from(res).some(
          (school) =>
            school.name === name &&
            school.district === district &&
            school.subDistrict === subDistrict &&
            school.province === province,
        )
      ) {
        return;
      }

      res.push({
        name: addSpaceBetweenThaiAndBracket(name),
        subDistrict,
        district,
        province,
        level: level?.replace("]", ""),
      });
    });
  });

  return res;
};

export const getAllList = async () => {
  const res = provinces.map((province) => getList(province));
  return Promise.all(res);
};
