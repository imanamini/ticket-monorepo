import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private dbName = 'apiCacheDB';
  private storeName = 'apiResponses';

  constructor() {
    this.initializeDB();
  }

  private async initializeDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (window.indexedDB) {
        const request = window.indexedDB.open(this.dbName, 1);
        request.onerror = (event) => {
          console.error('Error opening IndexedDB', event);
          reject(event);
        };

        request.onsuccess = (event) => {
          const db = (event.target as any).result;
          resolve(db);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as any).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, {
              keyPath: 'url',
            });
            // Check if index already exists before creating it
            if (!store.indexNames.contains('url')) {
              store.createIndex('url', 'url', { unique: true });
            }
          }
        };
      } else {
        console.error('IndexedDB not supported in this browser');
      }
    });
  }

  public async getFromCache(url: string): Promise<any> {
    // Todo: save with hash of url + params
    const db = await this.initializeDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('url');
      const request = index.get(url);

      request.onsuccess = async (event) => {
        const data = (event.target as any).result;
        if (data && data.ttl !== 0) {
          const dataNow = Date.now();
          if (data.ttl < dataNow) {
            await this.deleteFromCache(data.url);
            resolve(null);
          }
        }
        resolve(data ? data.response : null);
      };

      request.onerror = (event) => {
        console.error('Error fetching data from cache', event);
        reject(event);
      };
    });
  }

  public async addToCache(url: string, response: any, ttl = 0): Promise<void> {
    const db = await this.initializeDB();
    let computedTtl;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      if (ttl !== 0) {
        computedTtl = Date.now() + ttl;
      } else {
        computedTtl = 0;
      }
      const data = { url, response, ttl: computedTtl };
      const request = store.put(data);
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async flushCache(): Promise<void> {
    const db = await this.initializeDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    store.clear();
  }

  async deleteFromCache(url: string, isHashedBefore = true): Promise<void> {
    const db = await this.initializeDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    if (isHashedBefore) {
      store.delete(url);
    } else {
      store.delete(this.makeUrlIndex(url));
    }
  }

  makeRequestUrlIndex(req: HttpRequest<any>): string {
    const processedUrl = req.url.replace(/^.*\/digipay/, '/digipay');
    if (req.method === 'GET') {
      return Md5.hashStr(processedUrl);
    } else {
      return Md5.hashStr(JSON.stringify(req.body) + req.url);
    }
  }

  makeUrlIndex(url: string): string {
    return Md5.hashStr('/digipay/api/' + url);
  }
}
