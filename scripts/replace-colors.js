const fs = require('fs');
const path = require('path');

const directory = 'src/app';

const replacements = [
  { search: /bg-\[#081E19\]/g, replace: 'bg-background' },
  { search: /bg-\[#10231E\]/g, replace: 'bg-card' },
  { search: /bg-\[#10251e\]/g, replace: 'bg-card' },
  { search: /bg-\[#0C1F1A\]/g, replace: 'bg-secondary' },
  { search: /bg-\[#153426\]/g, replace: 'bg-muted' },
  { search: /bg-\[#16342D\]/g, replace: 'bg-muted' },
  { search: /bg-\[#113b2e\]/g, replace: 'bg-muted' },
  { search: /bg-\[#0f5b4c\]/g, replace: 'bg-primary' },
  { search: /text-\[#f8f5ef\]/g, replace: 'text-foreground' },
  { search: /text-\[#8ea79d\]/g, replace: 'text-muted-foreground' },
  { search: /text-\[#9fb4ab\]/g, replace: 'text-muted-foreground' },
  { search: /text-\[#d6b48c\]/g, replace: 'text-accent' },
  { search: /border-\[#29443C\]/g, replace: 'border-border' },
  { search: /border-\[#1f3d30\]/g, replace: 'border-border' },
  { search: /border-\[#1D362F\]/g, replace: 'border-border' },
  { search: /shadow-\[0_16px_45px_rgba\(3,15,11,0\.14\)\]/g, replace: 'shadow-lg' },
  { search: /shadow-\[0_18px_50px_rgba\(3,15,11,0\.22\)\]/g, replace: 'shadow-xl' },
  { search: /shadow-\[0_10px_25px_rgba\(15,91,76,0\.2\)\]/g, replace: 'shadow-md' },
  { search: /hover:bg-\[#16342D\]/g, replace: 'hover:bg-muted' },
  { search: /hover:bg-\[#153426\]/g, replace: 'hover:bg-muted' },
  { search: /hover:bg-\[#10231E\]/g, replace: 'hover:bg-card' },
  { search: /hover:bg-\[#144433\]/g, replace: 'hover:bg-primary/90' },
  { search: /disabled:bg-\[#16342D\]/g, replace: 'disabled:bg-muted' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(directory);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
