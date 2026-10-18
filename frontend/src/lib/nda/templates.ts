import fs from "node:fs";
import path from "node:path";

/**
 * Templates live in the repo-root templates/ directory (see catalog.json), one level
 * above this app. Read synchronously so the page is prerendered at build time.
 */
const TEMPLATES_DIR = path.join(process.cwd(), "..", "templates");

export function readTemplate(filename: string): string {
  return fs.readFileSync(path.join(TEMPLATES_DIR, filename), "utf-8");
}
