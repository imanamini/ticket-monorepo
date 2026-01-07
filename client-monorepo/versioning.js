/*
this Scripts detects current version during the build process and writes it to environment files, this script should run before build
 */

const fs = require('fs');
const path = require('path');

// Get app name from command line arguments (defaults to 'dpx' for backward compatibility)
const appName = process.argv[2] || 'dpx';

const ngswFilePath = path.resolve(__dirname, `apps/${appName}/ngsw-config.json`);
const envFolderPath = path.resolve(__dirname, `apps/${appName}/src/environments`);

if (!fs.existsSync(ngswFilePath)) {
  console.error('❌ ngsw-config.json not found.');
  process.exit(1);
}

const ngswJson = JSON.parse(fs.readFileSync(ngswFilePath, 'utf8'));
const version = ngswJson.appData?.version;

if (!version) {
  console.error('❌ Version not found in ngsw.json.');
  process.exit(1);
}

if (fs.existsSync(envFolderPath) && fs.statSync(envFolderPath).isDirectory()) {
  const envFiles = fs.readdirSync(envFolderPath);
  envFiles.forEach(file => {
    const filePath = path.join(envFolderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      let envContent = fs.readFileSync(filePath, 'utf8');
      if (envContent.includes('appVersion')) {
        envContent = envContent.replace(/appVersion:\s*['"`](.*?)['"`]/, `appVersion: '${version}'`);
      } else {
        envContent = envContent.replace(/(export const environment\s*=\s*{)([\s\S]*?)(};)/, (match, start, body, end) => {
          const hasTrailingComma = body.trim().endsWith(',');
          const newBody = hasTrailingComma
            ? `${body}\n  appVersion: '${version}',`
            : `${body},\n  appVersion: '${version}'`;
          return `${start}${newBody}\n${end}`;
        });
      }
      fs.writeFileSync(filePath, envContent, { encoding: 'utf8' });
    }
  });
} else {
  console.log('❌ Environment Directory not found.');
}

