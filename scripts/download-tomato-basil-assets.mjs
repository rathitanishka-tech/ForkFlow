import fs from 'fs';
import path from 'path';
import https from 'https';

const images = {
  'pasta-hero.jpg': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=1400&q=85',
  'dining-tables.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85',
  'reserved-sign.jpg': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=85',
  'qr-table.jpg': 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=85',
  'kitchen-flame.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=85',
  'analytics-screen.jpg': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85',
  'tomatoes-basil.png': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=85'
};

const dir = path.join(process.cwd(), 'public', 'images', 'landing');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const [name, url] of Object.entries(images)) {
    const dest = path.join(dir, name);
    console.log(`Downloading ${name}...`);
    try {
      await download(url, dest);
      const stats = fs.statSync(dest);
      console.log(`Downloaded ${name}: ${stats.size} bytes`);
    } catch (e) {
      console.error(`Error downloading ${name}:`, e.message);
    }
  }
}

main();

