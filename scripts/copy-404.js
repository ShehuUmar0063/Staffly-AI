import fs from 'fs';

try {
  if (fs.existsSync('dist/index.html')) {
    fs.copyFileSync('dist/index.html', 'dist/404.html');
    console.log('✓ Successfully created dist/404.html for GitHub Pages SPA support');
  }
} catch (err) {
  console.warn('Warning: Could not duplicate index.html to 404.html:', err.message);
}
