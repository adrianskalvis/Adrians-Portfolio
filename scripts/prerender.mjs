import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(projectRoot, "dist/index.html");
const serverOutputPath = resolve(projectRoot, "dist-server/entry-server.js");

const [{ render }, template] = await Promise.all([
  import(serverOutputPath),
  readFile(outputPath, "utf8"),
]);

const appHtml = render();
const prerendered = template.replace(
  /<div id="root">[\s\S]*?<\/div>/,
  `<div id="root">${appHtml}</div>`,
);

if (prerendered === template) {
  throw new Error("Could not find the #root placeholder in dist/index.html");
}

await writeFile(outputPath, prerendered);
await rm(resolve(projectRoot, "dist-server"), { recursive: true, force: true });

console.log("Prerendered the portfolio into dist/index.html");
