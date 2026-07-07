/**
 * Downloads destination-specific images using stable Wikimedia CDN thumbnail URLs.
 * These are direct image links — no API calls, no rate limiting.
 * All images are public domain or CC-licensed from Wikimedia Commons.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'destinations');

// Stable Wikimedia Commons thumbnail CDN URLs — direct image links
const DESTINATIONS = {
  agra: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1200px-Taj_Mahal_%28Edited%29.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Agra_Fort%2C_the_main_entrance_%28Amar_Singh_gate%29.jpg/1200px-Agra_Fort%2C_the_main_entrance_%28Amar_Singh_gate%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Fatehpur_Sikri%2C_India.jpg/1200px-Fatehpur_Sikri%2C_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Taj_Mahal_reflecting_pool.jpg/1200px-Taj_Mahal_reflecting_pool.jpg',
  ],
  kashmir: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Dal_Lake_Srinagar_Kashmir.jpg/1200px-Dal_Lake_Srinagar_Kashmir.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Gulmarg_-_gondola.jpg/1200px-Gulmarg_-_gondola.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Pahalgam_valley_of_kashmir.jpg/1200px-Pahalgam_valley_of_kashmir.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Shikara_Boats_Dal_Lake_Kashmir.jpg/1200px-Shikara_Boats_Dal_Lake_Kashmir.jpg',
  ],
  kerala: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kerala_backwaters.jpg/1200px-Kerala_backwaters.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Munnar_Tea_Plantations.jpg/1200px-Munnar_Tea_Plantations.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Alleppey_Backwaters.jpg/1200px-Alleppey_Backwaters.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Fort_Cochin_Beach.jpg/1200px-Fort_Cochin_Beach.jpg',
  ],
  dubai: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Marina_Skyline.jpg/1200px-Dubai_Marina_Skyline.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa_from_downtown_Dubai_2.jpg/800px-Burj_Khalifa_from_downtown_Dubai_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Skyline_%28wedding_cake_building%29.jpg/1200px-Dubai_Skyline_%28wedding_cake_building%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Dubai_Creek_2007.jpg/1200px-Dubai_Creek_2007.jpg',
  ],
  bali: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Jatiluwih_Rice_Terraces%2C_Bali.jpg/1200px-Jatiluwih_Rice_Terraces%2C_Bali.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Pura_Uluwatu_Temple%2C_Bali.jpg/1200px-Pura_Uluwatu_Temple%2C_Bali.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pura_Tanah_Lot%2C_Bali.jpg/1200px-Pura_Tanah_Lot%2C_Bali.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ubud_Monkey_Forest_Bali.jpg/1200px-Ubud_Monkey_Forest_Bali.jpg',
  ],
  goa: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Baga_beach_Goa.jpg/1200px-Baga_beach_Goa.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Basilica_of_Bom_Jesus%2C_Goa_%28Exterior%29.jpg/1200px-Basilica_of_Bom_Jesus%2C_Goa_%28Exterior%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Fort_Aguada_Goa.jpg/1200px-Fort_Aguada_Goa.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Calangute_beach_Goa_India.jpg/1200px-Calangute_beach_Goa_India.jpg',
  ],
  ladakh: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Pangong_Lake_Ladakh_India.jpg/1200px-Pangong_Lake_Ladakh_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Leh_Palace%2C_Ladakh%2C_India.jpg/1200px-Leh_Palace%2C_Ladakh%2C_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Nubra_Valley_Ladakh_India.jpg/1200px-Nubra_Valley_Ladakh_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Thikse_Monastery_Ladakh.jpg/1200px-Thikse_Monastery_Ladakh.jpg',
  ],
  jaipur: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Amber_Fort%2C_Jaipur%2C_Rajasthan.jpg/1200px-Amber_Fort%2C_Jaipur%2C_Rajasthan.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hawa_Mahal%2C_Jaipur2.jpg/800px-Hawa_Mahal%2C_Jaipur2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Jaipur_City_Palace.jpg/1200px-Jaipur_City_Palace.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Jantar_Mantar_Jaipur.jpg/1200px-Jantar_Mantar_Jaipur.jpg',
  ],
  darjeeling: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tea_garden%2C_Darjeeling.jpg/1200px-Tea_garden%2C_Darjeeling.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/DHR_-_Darjeeling_Himalayan_Railway.jpg/1200px-DHR_-_Darjeeling_Himalayan_Railway.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/View_of_Kanchenjunga_from_Tiger_Hill.jpg/1200px-View_of_Kanchenjunga_from_Tiger_Hill.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Batasia_Loop_Darjeeling.jpg/1200px-Batasia_Loop_Darjeeling.jpg',
  ],
  kanha: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Kanha_Tiger_Reserve_India.jpg/1200px-Kanha_Tiger_Reserve_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Bengal_Tiger_Ranthambore.jpg/1200px-Bengal_Tiger_Ranthambore.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Chital_spotted_deer_India.jpg/1200px-Chital_spotted_deer_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Indian_Gaur_Bison.jpg/1200px-Indian_Gaur_Bison.jpg',
  ],
  mysore: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mysuru_Palace_Front.jpg/1200px-Mysuru_Palace_Front.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Mysore_Palace_at_Night_Illumination.jpg/1200px-Mysore_Palace_at_Night_Illumination.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Chamundeshwari_temple_-_Chamundi_Hill.jpg/1200px-Chamundeshwari_temple_-_Chamundi_Hill.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Brindavan_Gardens_Mysore_Karnataka.jpg/1200px-Brindavan_Gardens_Mysore_Karnataka.jpg',
  ],
  rishikesh: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Lakshman_Jhula_Rishikesh.jpg/1200px-Lakshman_Jhula_Rishikesh.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ganga_Aarti_Haridwar_India.jpg/1200px-Ganga_Aarti_Haridwar_India.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rafting_on_Ganga_river_Rishikesh.jpg/1200px-Rafting_on_Ganga_river_Rishikesh.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Ram_Jhula_Rishikesh.jpg/1200px-Ram_Jhula_Rishikesh.jpg',
  ],
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ParyatanBot/1.0; +https://paryatanholidays.com)',
      'Accept': 'image/jpeg,image/png,image/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let totalOk = 0, totalFail = 0;

  for (const [key, urls] of Object.entries(DESTINATIONS)) {
    const destFolder = join(OUT_DIR, key);
    mkdirSync(destFolder, { recursive: true });
    console.log(`\n📍 ${key.toUpperCase()}`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const outFile = join(destFolder, `${i + 1}.jpg`);

      try {
        process.stdout.write(`  [${i + 1}/${urls.length}] `);
        const bytes = await downloadImage(url, outFile);
        console.log(`✓ ${(bytes / 1024).toFixed(0)} KB`);
        totalOk++;
      } catch (err) {
        console.log(`✗ ${err.message}  (${url.split('/').pop()})`);
        totalFail++;
      }

      // 1.5s between each download to respect Wikimedia bandwidth
      await sleep(1500);
    }
  }

  console.log(`\n\n✅ Done! ${totalOk} downloaded, ${totalFail} failed`);
  console.log(`📁 Saved to: public/images/destinations/`);
}

main().catch(console.error);
