const fs = require('fs');
const path = require('path');

const ngswWorkerFilePath = path.join(__dirname, 'node_modules', '@angular', 'service-worker', 'ngsw-worker.js');
let ngswWorkerFile = fs.readFileSync(ngswWorkerFilePath).toString();

const linesToRemove = [
  `this.scope.addEventListener("push", (event) => this.onPush(event));`,
  `this.scope.addEventListener("notificationclick", (event) => this.onClick(event));`
];

ngswWorkerFile = ngswWorkerFile
  .split('\n')
  .filter(line => !linesToRemove.includes(line.trim()))
  .join('\n');

ngswWorkerFile += `
  if ('function' === typeof importScripts) {
    try {
      importScripts('https://static1.intrack.ir/api/web/download/sdk/v1/inTrack-sw.min.js');
    } catch (error) {
      console.error('Failed to load InTrack service worker script:', error);
    }
  }
`;

fs.writeFileSync(ngswWorkerFilePath, ngswWorkerFile);
