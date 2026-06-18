#!/usr/bin/env node
/**
 * gen-pwa-icons.mjs — generate AsideMe-branded PNG icons for the PWA manifest.
 *
 * Renders the AsideMe mark (em-dash on near-black) into raw RGBA, then writes
 * a valid PNG using only Node's built-in zlib. No image library dependency.
 *
 * Outputs into public/icons/:
 *   - icon-192.png            (manifest "any")
 *   - icon-512.png            (manifest "any" + splash)
 *   - icon-maskable-512.png   (manifest "maskable" — 20% safe zone)
 *   - apple-touch-icon-180.png (iOS home screen)
 *
 * Run: node scripts/gen-pwa-icons.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");

// ── Brand colors (from public/mark.svg) ──────────────────────────────────────
const BG = [0x0b, 0x0b, 0x0e, 0xff]; // stage / near-black
const FG = [0xff, 0x3c, 0x4b, 0xff]; // AsideMe accent red

// ── CRC32 (PNG spec) ─────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ── Write a single PNG chunk ─────────────────────────────────────────────────
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// ── Encode RGBA pixel buffer as PNG ──────────────────────────────────────────
function encodePNG(width, height, rgba) {
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT — prefix each scanline with filter byte 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Render the mark into an RGBA buffer ──────────────────────────────────────
// safeZone = fraction of canvas reserved as inner safe area (for maskable).
// 0 = bar fills 50% of width like favicon; 0.2 = bar shrinks 20% per side.
function renderMark(size, opts = {}) {
  const { safeZone = 0 } = opts;
  const rgba = Buffer.alloc(size * size * 4);

  // Fill background
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = BG[0];
    rgba[i + 1] = BG[1];
    rgba[i + 2] = BG[2];
    rgba[i + 3] = BG[3];
  }

  // Em-dash bar dimensions — match mark.svg ratio (128/256 wide, 14/256 tall).
  // For maskable we shrink the bar to fit inside the safe zone so masking
  // doesn't crop the brand mark.
  const fullW = size * 0.5;
  const fullH = size * (14 / 256);
  const inset = size * safeZone;
  const barW = Math.round(Math.min(fullW, size - inset * 2));
  const barH = Math.max(2, Math.round(fullH));
  const x0 = Math.round((size - barW) / 2);
  const y0 = Math.round((size - barH) / 2);

  for (let y = y0; y < y0 + barH; y++) {
    for (let x = x0; x < x0 + barW; x++) {
      const idx = (y * size + x) * 4;
      rgba[idx] = FG[0];
      rgba[idx + 1] = FG[1];
      rgba[idx + 2] = FG[2];
      rgba[idx + 3] = FG[3];
    }
  }

  return rgba;
}

function writeIcon(filename, size, opts) {
  const rgba = renderMark(size, opts);
  const png = encodePNG(size, size, rgba);
  const path = join(OUT_DIR, filename);
  writeFileSync(path, png);
  console.log(`✓ ${filename} (${size}x${size}, ${png.length} bytes)`);
}

// ── Run ──────────────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
writeIcon("icon-192.png", 192);
writeIcon("icon-512.png", 512);
// Maskable icons need a 20% safe zone per W3C spec — shrink the bar so the
// platform's mask (circle, squircle, etc.) doesn't crop the em-dash.
writeIcon("icon-maskable-512.png", 512, { safeZone: 0.2 });
writeIcon("apple-touch-icon-180.png", 180);
console.log("Done.");
