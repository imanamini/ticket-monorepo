import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { ImeiPattern } from '../../../../../../util/patterns';

@Injectable({
  providedIn: 'root'
})
export class ExtractIMEIService {
  async processImage(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const worker = await createWorker('eng');
          await worker.load();
          const {data: {text}} = await worker.recognize(reader.result as string);
          const imei = this.extractIMEI(text);
          await worker.terminate();
          resolve(imei);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  extractIMEI(text: string): string {
    const match = text.match(ImeiPattern);
    if (match) {
      return match[0];
    } else {
      return null;
    }
  }
}
