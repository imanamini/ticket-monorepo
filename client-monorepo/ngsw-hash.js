const fs = require('fs');
const path = require('path');

function sha1(str) {
  const utf8 = str;
  const words32 = stringToWords32(utf8, Endian.Big);
  return _sha1(words32, utf8.length * 8);
}
function _sha1(words32, len) {
  const w = [];
  let [a, b, c, d, e] = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  words32[len >> 5] |= 128 << 24 - len % 32;
  words32[(len + 64 >> 9 << 4) + 15] = len;
  for (let i = 0; i < words32.length; i += 16) {
    const [h0, h1, h2, h3, h4] = [a, b, c, d, e];
    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = words32[i + j];
      } else {
        w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      const [f, k] = fk(j, b, c, d);
      const temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
      [e, d, c, b, a] = [d, c, rol32(b, 30), a, temp];
    }
    [a, b, c, d, e] = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)];
  }
  return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
}
function add32(a, b) {
  return add32to64(a, b)[1];
}
function add32to64(a, b) {
  const low = (a & 65535) + (b & 65535);
  const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
  return [high >>> 16, high << 16 | low & 65535];
}
function rol32(a, count) {
  return a << count | a >>> 32 - count;
}
var Endian;
(function(Endian2) {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function fk(index, b, c, d) {
  if (index < 20) {
    return [b & c | ~b & d, 1518500249];
  }
  if (index < 40) {
    return [b ^ c ^ d, 1859775393];
  }
  if (index < 60) {
    return [b & c | b & d | c & d, 2400959708];
  }
  return [b ^ c ^ d, 3395469782];
}
function stringToWords32(str, endian) {
  const size = str.length + 3 >>> 2;
  const words32 = [];
  for (let i = 0; i < size; i++) {
    words32[i] = wordAt(str, i * 4, endian);
  }
  return words32;
}
function arrayBufferToWords32(buffer, endian) {
  const size = buffer.byteLength + 3 >>> 2;
  const words32 = [];
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    words32[i] = wordAt(view, i * 4, endian);
  }
  return words32;
}
function byteAt(str, index) {
  if (typeof str === "string") {
    return index >= str.length ? 0 : str.charCodeAt(index) & 255;
  } else {
    return index >= str.byteLength ? 0 : str[index] & 255;
  }
}
function wordAt(str, index, endian) {
  let word = 0;
  if (endian === Endian.Big) {
    for (let i = 0; i < 4; i++) {
      word += byteAt(str, index + i) << 24 - 8 * i;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      word += byteAt(str, index + i) << 8 * i;
    }
  }
  return word;
}
function words32ToByteString(words32) {
  return words32.reduce((str, word) => str + word32ToByteString(word), "");
}
function word32ToByteString(word) {
  let str = "";
  for (let i = 0; i < 4; i++) {
    str += String.fromCharCode(word >>> 8 * (3 - i) & 255);
  }
  return str;
}
function byteStringToHexString(str) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const b = byteAt(str, i);
    hex += (b >>> 4).toString(16) + (b & 15).toString(16);
  }
  return hex.toLowerCase();
}

function hashManifest(manifest) {
  return sha1(JSON.stringify(manifest));
}


const DIST_DIR = path.resolve(__dirname, 'dist/apps/app/browser');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');
const NGSW_JSON = path.join(DIST_DIR, 'ngsw.json');

if (!fs.existsSync(NGSW_JSON)) {
  console.error('ngsw.json not found');
  process.exit(1);
}

const ngswContent = fs.readFileSync(NGSW_JSON, 'utf-8');
const ngswObject = JSON.parse(ngswContent);


let indexInNgsw = false;

if (ngswObject?.assetGroups) {
  for(const group of ngswObject.assetGroups) {
    const urls = group.urls || [];
    if (urls.includes('/index.html')) {
      indexInNgsw = true
      break;
    }
  }
}
if (indexInNgsw) {
  console.error("index.html is included in ngsw.json")
  process.exit(1)
}

const ngswHash = hashManifest(ngswObject);

let indexHtml = fs.readFileSync(INDEX_HTML, 'utf-8');

const scriptTag = `<script>window.__NGSW_HASH__ = "${ngswHash}";</script>`;
indexHtml = indexHtml.replace('</head>', `${scriptTag}\n</head>`);

fs.writeFileSync(INDEX_HTML, indexHtml, 'utf-8');

