import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import settings from "../src/content/site/settings.json" with { type: "json" };
import amenities from "../src/content/amenities/list.json" with { type: "json" };

const dist = path.resolve("dist");
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(dir, acc = []) {
  return readdir(dir, { withFileTypes: true }).then(async (entries) => {
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full, acc);
      else acc.push(full);
    }
    return acc;
  });
}

const included = amenities.groups.filter((group) => group.included).flatMap((group) => group.items);
const excluded = amenities.groups.filter((group) => !group.included).flatMap((group) => group.items);
if (included.length !== 56) fail(`Expected 56 included amenities, found ${included.length}`);
if (excluded.length !== 3) fail(`Expected 3 not-included amenities, found ${excluded.length}`);

let files;
try {
  await stat(dist);
  files = await walk(dist);
} catch {
  fail("dist/ is missing. Run npm run build first.");
  console.error(failures.join("\n"));
  process.exit(1);
}

const htmlFiles = files.filter((file) => file.endsWith(".html"));
if (!htmlFiles.length) fail("No HTML files were built.");

const titles = new Map();
const bookingBase = new URL(settings.booking.url);

function pageLang(file) {
  const rel = path.relative(dist, file).split(path.sep).join("/");
  return rel === "he/index.html" || rel.startsWith("he/") ? "he" : "en";
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const rel = path.relative(dist, file);
  const lang = pageLang(file);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
  if (!title) fail(`${rel} is missing a title`);
  if (titles.has(title)) fail(`Duplicate title "${title}" on ${rel} and ${titles.get(title)}`);
  titles.set(title, rel);

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
  if (description.length < 40) fail(`${rel} description is missing or too short`);
  if (!html.includes('rel="canonical"')) fail(`${rel} is missing a canonical`);
  for (const code of ["en", "he", "x-default"]) {
    if (!html.includes(`hreflang="${code}"`)) fail(`${rel} is missing hreflang ${code}`);
  }
  if (!html.includes("application/ld+json")) fail(`${rel} is missing JSON-LD`);
  if (html.includes("streetAddress")) fail(`${rel} includes a street address`);

  if (rel !== "404.html") {
    if (lang === "he" && !html.includes('lang="he"') && !html.includes("lang=\"he\"")) {
      fail(`${rel} should be Hebrew`);
    }
    if (lang === "he" && !html.includes('dir="rtl"')) fail(`${rel} should be dir=rtl`);
    if (lang === "en" && !html.includes('dir="ltr"')) fail(`${rel} should be dir=ltr`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) =>
    match[1].replace(/&amp;/g, "&").replace(/&#38;/g, "&"),
  );
  for (const href of hrefs) {
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) continue;
    if (href.startsWith("http://") || href.startsWith("https://")) {
      let url;
      try {
        url = new URL(href);
      } catch {
        fail(`${rel} has an invalid URL ${href}`);
        continue;
      }
      if (url.hostname.includes("airbnb.com")) {
        if (url.origin + url.pathname !== bookingBase.origin + bookingBase.pathname) {
          fail(`${rel} Airbnb link does not use the configured listing: ${href}`);
        }
        for (const [key, value] of Object.entries(settings.booking.utm)) {
          if (url.searchParams.get(key) !== value) {
            fail(`${rel} Airbnb link missing ${key}=${value}: ${href}`);
          }
        }
        if (!url.searchParams.get("utm_content")) fail(`${rel} Airbnb link missing utm_content: ${href}`);
        const placement = url.searchParams.get("utm_content");
        if (placement && !settings.booking.placements.includes(placement)) {
          fail(`${rel} unknown booking placement "${placement}"`);
        }
      }
      continue;
    }
    if (href.startsWith("/")) {
      const clean = href.split("#")[0].split("?")[0];
      const target =
        clean === "/"
          ? path.join(dist, "index.html")
          : clean.endsWith("/")
            ? path.join(dist, clean.replace(/^\/+|\/+$/g, ""), "index.html")
            : path.join(dist, clean.replace(/^\/+/, ""));
      const exists = files.some((item) => path.resolve(item) === path.resolve(target));
      if (!exists) fail(`${rel} links to missing ${href}`);
    }
  }
}

const partyHits = [];
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const text = html.replace(/<[^>]+>/g, " ");
  if (/\bparty\b/i.test(text) && !/no parties/i.test(text)) partyHits.push(path.relative(dist, file));
  if (text.includes("מסיבה") && !text.includes("אין מסיבות")) partyHits.push(path.relative(dist, file));
}
if (partyHits.length) fail(`Party language outside the house rule: ${partyHits.join(", ")}`);

const robots = files.find((file) => file.endsWith(`${path.sep}robots.txt`));
if (!robots) fail("robots.txt was not generated");
else {
  const body = await readFile(robots, "utf8");
  if (!body.includes("Sitemap:")) fail("robots.txt is missing a sitemap line");
}
if (!files.some((file) => file.endsWith("sitemap-index.xml") || file.endsWith("sitemap-0.xml"))) {
  fail("sitemap was not generated");
}

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} pages, ${included.length} amenities, booking links, hreflang, and RTL.`);
