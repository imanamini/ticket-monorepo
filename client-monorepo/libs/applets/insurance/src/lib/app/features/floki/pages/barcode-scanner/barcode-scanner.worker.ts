// /// <reference lib="webworker" />
//
// import { BarcodeDetector } from 'barcode-detector';
//
// let detector: any = null;
// let isReady = false;
//
// const formats = ['code_128', 'ean_13', 'ean_8'];
//
// addEventListener('message', async ({data}) => {
//   const {type, image, id} = data;
//
//   switch (type) {
//     case 'init':
//       try {
//         console.log('Worker: Initializing Detector...');
//         detector = new BarcodeDetector({formats: formats as any[]});
//         isReady = true;
//         postMessage({type: 'init-done', success: true});
//       } catch (e) {
//         console.error('Worker: Init failed', e);
//       }
//       break;
//
//     case 'detect':
//       if (!isReady || !detector) {
//         postMessage({type: 'result', id, content: null});
//         return;
//       }
//
//       try {
//         // عملیات سنگین تشخیص اینجا انجام می‌شود
//         const results = await detector.detect(image);
//
//         // بستن ImageBitmap برای آزادسازی حافظه (خیلی مهم)
//         if (image && typeof image.close === 'function') {
//           image.close();
//         }
//
//         const content = results.length > 0 ? results[0].rawValue : null;
//         postMessage({type: 'result', id, content});
//
//       } catch (e) {
//         postMessage({type: 'result', id, content: null});
//       }
//       break;
//   }
// });
