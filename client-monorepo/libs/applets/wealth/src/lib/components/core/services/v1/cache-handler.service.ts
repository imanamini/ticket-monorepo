import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';

interface CacheEntry<T> {
  subject: BehaviorSubject<TServiceResult<T> | null>;
  timestamp: number;
}

export enum ETTL {
  SHORT_TTL = 300_000, // 5m
  DEFAULT_TTL = 3_600_000, // 1h
  LONG_TTL = 14_400_000, // 4h
}

@Injectable({
  providedIn: 'root',
})
export class CacheHandlerService {
  private keys = new Map<string, object>();
  private cache = new WeakMap<object, CacheEntry<any>>();

  private isCacheValid<T>(keyObj: object, ttl: number): boolean {
    if (!this.cache.has(keyObj)) return false;
    const cached = this.cache.get(keyObj)!;
    const now = Date.now();
    return !!cached.subject.value?.result && now - cached.timestamp < ttl;
  }

  getOrFetch<T>(
    keyObj: object,
    apiCall: () => Observable<TServiceResult<T>>,
    ttl: number = ETTL.DEFAULT_TTL,
  ): Observable<TServiceResult<T>> {
    if (this.isCacheValid<T>(keyObj, ttl)) {
      return this.cache.get(keyObj)!.subject.asObservable();
    }

    const cached = this.cache.get(keyObj);
    const subject = cached?.subject || new BehaviorSubject<TServiceResult<T> | null>(null);
    this.cache.set(keyObj, { subject, timestamp: Date.now() });

    apiCall()
      .pipe(catchError((err) => this.handleError<T>(err)))
      .subscribe((data) => {
        this.cache.set(keyObj, { subject, timestamp: Date.now() });
        subject.next(data);
      });

    return subject.asObservable().pipe(filter((val): val is TServiceResult<T> => val !== null));
  }

  private handleError<T>(error: unknown): Observable<never> {
    const err = error instanceof Error ? error : new Error(String(error));
    return throwError(() => err);
  }

  clearCache(keyObj?: object) {
    if (keyObj) {
      this.cache.delete(keyObj);
    }
  }

  getKey(name: string, page: number | string) {
    const compositeKey = `${name}_${page}`;
    if (!this.keys.has(compositeKey)) {
      this.keys.set(compositeKey, { name, page });
    }
    return this.keys.get(compositeKey);
  }
}
