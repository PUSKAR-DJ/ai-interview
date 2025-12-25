import fs from "fs";
import { parse } from "csv-parse/sync";

export const parseCSV = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records;
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    throw new Error("Failed to parse CSV file");
  }
};
