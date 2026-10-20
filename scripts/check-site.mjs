// Post-build site check. Run `npm run build` first, then `npm run check`.
//
// 1. Every internal link and asset referenced by the built pages exists in dist/.
// 2. Every Backblaze media file the pages load in the browser responds. These are
//    never fetched during the build, so a missing file would otherwise only show up
//    as a broken image or video for visitors.
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { albums } from '../src/data/albums.js';

const DIST = new URL('../dist/', import.meta.url).pathname;
const MEDIA_HOST = 'https://f004.backblazeb2.com/';
// Album pages load photos 2..N from their script, so they don't appear in the HTML
const albumPhotoUrl = (slug, n) =>
  `${MEDIA_HOST}file/ethan-site-media/images/photographs/${slug}/${n}.webp`;

const failures = [];

// Collect every URL referenced by href, src, poster, data-video-src or srcset attributes
function urlsIn(html) {
  const urls = [];
  for (const [, name, value] of html.matchAll(/\s(href|src|poster|data-video-src|srcset)="([^"]*)"/g)) {
    if (name === 'srcset') {
      urls.push(...value.split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    } else {
      urls.push(value);
    }
  }
  return urls;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// "/films/" -> dist/films/index.html, "/_astro/x.css" -> dist/_astro/x.css, "/films" -> either
async function internalTargetExists(url) {
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (path.endsWith('/')) return exists(join(DIST, path, 'index.html'));
  return (await exists(join(DIST, path))) || exists(join(DIST, path, 'index.html'));
}

const pages = (await readdir(DIST, { recursive: true })).filter(file => file.endsWith('.html'));
const mediaUrls = new Set();

for (const page of pages) {
  const html = await readFile(join(DIST, page), 'utf8');
  for (const url of urlsIn(html)) {
    if (url.startsWith('/') && !url.startsWith('//')) {
      if (!(await internalTargetExists(url))) failures.push(`${page}: missing ${url}`);
    } else if (url.startsWith(MEDIA_HOST)) {
      mediaUrls.add(url);
    }
  }
}

for (const album of albums) {
  album.photos.forEach((_, i) => mediaUrls.add(albumPhotoUrl(album.slug, i + 1)));
}

// HEAD requests, a few at a time, so nothing is downloaded
const queue = [...mediaUrls];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) failures.push(`media ${response.status}: ${url}`);
    } catch (error) {
      failures.push(`media request failed: ${url} (${error.message})`);
    }
  }
}));

console.log(`Checked ${pages.length} pages and ${mediaUrls.size} media files.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n${failures.map(f => `  - ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('All good.');
