import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repoRoot = process.cwd();
const inputPath = join(repoRoot, "POST.json");
const outputDir = "/output";
const outputPath = join(outputDir, "POST.json");

const raw = readFileSync(inputPath, "utf8");
const data = JSON.parse(raw);

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  console.error("POST.json must be a JSON object");
  process.exit(1);
}
if (typeof data.url !== "string") {
  console.error("POST.json must have a string url field");
  process.exit(1);
}
const statusUrlPattern =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+(\?.*)?(#.*)?$|^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/i\/web\/status\/\d+(\?.*)?(#.*)?$/;
if (!statusUrlPattern.test(data.url)) {
  console.error(`Invalid X status URL in POST.json: ${data.url}`);
  process.exit(1);
}

mkdirSync(dirname(outputPath), { recursive: true });
// Copy the input bytes unchanged so /output/POST.json is byte-identical.
writeFileSync(outputPath, raw, "utf8");
console.log(`Wrote ${outputPath}`);
