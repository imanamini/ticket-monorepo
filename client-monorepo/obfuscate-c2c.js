const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const DIST_DIR = 'dist/apps/app';
const TARGET_PATTERN = /C2cMainComponent/;

function getJsFiles(dir) {
  let jsFiles = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      jsFiles = jsFiles.concat(getJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      jsFiles.push(fullPath);
    }
  }
  return jsFiles;
}

function obfuscateMatchingChunks() {
  const files = getJsFiles(DIST_DIR);

  let count = 0;

  for (const filePath of files) {
    const code = fs.readFileSync(filePath, 'utf-8');

    if (TARGET_PATTERN.test(code)) {
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 4000,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayCallsTransform: false,
        stringArrayEncoding: [],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      }).getObfuscatedCode();

      fs.writeFileSync(filePath, obfuscatedCode);
      console.log(`✅ Obfuscated: ${filePath}`);
      count++;
    }
  }

  if (count === 0) {
    console.warn('No matching chunks found that reference "C2cMainComponent". Check your build output or path.');
  }
}

obfuscateMatchingChunks();
