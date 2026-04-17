import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dir  = fileURLToPath(new URL('.', import.meta.url));
const outDir = join(__dir, 'temporary screenshots');
if (!existsSync(outDir)) mkdirSync(outDir);

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? '-' + process.argv[3] : '';

const existing = readdirSync(outDir).filter(f => f.endsWith('.png'));
const n = existing.length + 1;
const filename = `screenshot-${n}${label}.png`;
const filePath = join(outDir, filename);

const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: filePath, fullPage: false });
await browser.close();

console.log('Screenshot saved:', filePath);
