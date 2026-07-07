import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const apiFiles = ['chat', 'destinations', 'experiences', 'services', 'testimonials', 'tour', 'tours', 'video-analyze', 'generate-image', 'bookings', 'inquiries', 'db-wake'];

for (const name of apiFiles) {
  try {
    const mod = await import(`./api/${name}.js`);
    if (name === 'db-wake') {
      console.log(`  ✓ Loaded /api/${name} (module only)`);
    } else {
      const handler = mod.default;
      app.all(`/api/${name}`, handler);
      console.log(`  ✓ Mounted /api/${name}`);
    }
  } catch (e) {
    console.warn(`  ✗ Skipped /api/${name}: ${e.message}`);
  }
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n  API server running at http://localhost:${PORT}\n`);
});
