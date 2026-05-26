const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'dist');
const destDir = path.join(rootDir, 'cloudflare-pages');

console.log('Copying build from dist/ to cloudflare-pages/...');

try {
  if (!fs.existsSync(srcDir)) {
    console.error('Error: dist/ folder does not exist. Run npm run build first.');
    process.exit(1);
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destAssetsDir = path.join(destDir, 'assets');
  if (fs.existsSync(destAssetsDir)) {
    console.log('Cleaning old assets in cloudflare-pages/assets...');
    const files = fs.readdirSync(destAssetsDir);
    for (const file of files) {
      const filePath = path.join(destAssetsDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }
  }

  if (fs.cpSync) {
    fs.cpSync(srcDir, destDir, { recursive: true });
  } else {
    const copyRecursive = (src, dest) => {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach((child) => {
          copyRecursive(path.join(src, child), path.join(dest, child));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    copyRecursive(srcDir, destDir);
  }
  console.log('Successfully copied all build assets to cloudflare-pages!');
} catch (err) {
  console.error('Failed to copy build:', err);
  process.exit(1);
}
