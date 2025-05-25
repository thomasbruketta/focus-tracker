/* Node script to assert JS bundle ≤150 kB gzipped */
import { gzipSync } from 'zlib';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';

const dist = path.resolve('dist/assets');
let total = 0;

try {
  for (const f of readdirSync(dist)) {
    if (f.endsWith('.js')) {
      total += gzipSync(readFileSync(path.join(dist, f))).length;
    }
  }
} catch (error) {
  console.error('Error reading dist/assets directory:', error.message);
  process.exit(1);
}

console.log(
  `Gzipped JS total: ${total} bytes (${(total / 1024).toFixed(2)} KB)`
);

if (total > 150_000) {
  console.error('❌ Bundle exceeds 150 kB limit');
  process.exit(1);
} else {
  console.log('✅ Bundle size within 150 kB limit');
}
