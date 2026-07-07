// Scans the pics/ folder and writes pics/manifest.js listing all gallery images.
// A plain <script> (not fetch) so the page works when opened directly as a file,
// with no local server and no CORS restrictions.
// Run this (double-click update-gallery.bat) after adding or removing photos in pics/.
const fs = require('fs');
const path = require('path');

const picsDir = path.join(__dirname, 'pics');
const manifestPath = path.join(picsDir, 'manifest.js');
const portraitFile = 'portrait.jpg';
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const files = fs.readdirSync(picsDir)
  .filter((file) => {
    if (file === portraitFile) return false;
    if (file === 'manifest.js') return false;
    return imageExtensions.has(path.extname(file).toLowerCase());
  })
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const content = 'window.GALLERY_IMAGES = ' + JSON.stringify(files, null, 2) + ';\n';
fs.writeFileSync(manifestPath, content);
console.log(`manifest.js updated with ${files.length} image(s).`);
