const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outputPath = path.join(root, 'public', 'env.js');

function parseDotenv(content) {
  return content
    .split(/\r?\n/) // split lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const equalsIndex = line.indexOf('=');
      if (equalsIndex === -1) {
        return acc;
      }
      const key = line.slice(0, equalsIndex).trim();
      let value = line.slice(equalsIndex + 1).trim();
      if (value.startsWith("\"") && value.endsWith("\"")) {
        value = value.slice(1, -1);
      }
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
}

const envValues = fs.existsSync(envPath)
  ? parseDotenv(fs.readFileSync(envPath, 'utf8'))
  : null;

if (envValues === null) {
  if (fs.existsSync(outputPath)) {
    console.log('No .env file found. Keeping existing public/env.js.');
    process.exit(0);
  }
}

const supabaseUrl = envValues?.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const supabaseAnonKey = envValues?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const fileContents = `window.env = {
  SUPABASE_URL: '${supabaseUrl.replace(/'/g, "\\'")}',
  SUPABASE_ANON_KEY: '${supabaseAnonKey.replace(/'/g, "\\'")}'
};\n`;

fs.writeFileSync(outputPath, fileContents, 'utf8');

if (!fs.existsSync(envPath)) {
  console.warn('Warning: .env file not found. Kept existing public/env.js or created placeholder values.');
}
