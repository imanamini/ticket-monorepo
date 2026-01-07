import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '@client-monorepo/common/utilities';

/**
 * Service to manage market name caching
 * Shared between MarketInterceptor and other services that need to clear the cache
 */
@Injectable({
  providedIn: 'root',
})
export class MarketCacheService {
  private memoryCache: string | null = null;

  /**
   * Get cached market name from memory or localStorage
   */
  getMarketName(): string | null {
    // First check memory cache
    if (this.memoryCache) {
      return this.memoryCache;
    }

    // Then check localStorage
    const stored = this.getFromStorage();
    if (stored) {
      this.memoryCache = stored;
      return stored;
    }

    return null;
  }

  /**
   * Save market name to both memory and localStorage
   */
  setMarketName(marketName: string): void {
    if (!marketName) return;

    this.memoryCache = marketName;
    this.saveToStorage(marketName);
  }

  /**
   * Clear cached market name from both memory and localStorage
   * Should be called on logout
   */
  clearCache(): void {
    this.memoryCache = null;
    this.removeFromStorage();
  }

  private getFromStorage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY.MARKET_NAME);
    } catch (error) {
      console.warn('[MarketCacheService] Failed to read from localStorage:', error);
      return null;
    }
  }

  private saveToStorage(marketName: string): void {
    try {
      localStorage.setItem(STORAGE_KEY.MARKET_NAME, marketName);
    } catch (error) {
      console.warn('[MarketCacheService] Failed to write to localStorage:', error);
    }
  }

  private removeFromStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY.MARKET_NAME);
    } catch (error) {
      console.warn('[MarketCacheService] Failed to remove from localStorage:', error);
    }
  }
}
