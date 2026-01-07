import { Injectable } from '@angular/core';
import { ProductInterface } from '../models/product.interface';
import { Store } from '../models/store.type';
import { RecentlyViewedData, RecentlyViewedProduct, RecentlyViewedStore } from '../models/recently-viewed.model';

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'recently_viewed';
  private readonly MAX_PRODUCTS = 6;
  private readonly MAX_STORES = 6;

  /**
   * Get all recently viewed data (products and stores)
   * This function can be replaced with an API call
   */
  getRecentlyViewed(): RecentlyViewedData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return { products: [], stores: [] };
      }
      return JSON.parse(data) as RecentlyViewedData;
    } catch (error) {
      console.error('Error reading recently viewed data:', error);
      return { products: [], stores: [] };
    }
  }

  /**
   * Get recently viewed products only
   * This function can be replaced with an API call
   */
  getRecentlyViewedProducts(): RecentlyViewedProduct[] {
    return this.getRecentlyViewed().products;
  }

  /**
   * Get recently viewed stores only
   * This function can be replaced with an API call
   */
  getRecentlyViewedStores(): RecentlyViewedStore[] {
    return this.getRecentlyViewed().stores;
  }

  /**
   * Save recently viewed data to storage
   * This function can be replaced with an API call
   */
  private saveRecentlyViewed(data: RecentlyViewedData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving recently viewed data:', error);
    }
  }

  /**
   * Add a product to recently viewed
   * This function can be replaced with an API call
   */
  addRecentlyViewedProduct(product: ProductInterface): void {
    const data = this.getRecentlyViewed();

    // Create recently viewed product object
    const recentlyViewedProduct: RecentlyViewedProduct = {
      ...product,
      viewedAt: Date.now(),
    };

    // Remove if already exists (to update timestamp and move to front)
    data.products = data.products.filter((p) => p.documentId !== product.documentId);

    // Add to beginning
    data.products.unshift(recentlyViewedProduct);

    // Keep only MAX_PRODUCTS items
    if (data.products.length > this.MAX_PRODUCTS) {
      data.products = data.products.slice(0, this.MAX_PRODUCTS);
    }

    this.saveRecentlyViewed(data);
  }

  /**
   * Add a store to recently viewed
   * This function can be replaced with an API call
   */
  addRecentlyViewedStore(store: Store): void {
    const data = this.getRecentlyViewed();

    // Create recently viewed store object
    const recentlyViewedStore: RecentlyViewedStore = {
      ...store,
      viewedAt: Date.now(),
    };

    // Remove if already exists (to update timestamp and move to front)
    data.stores = data.stores.filter((s) => s.businessId !== store.businessId);

    // Add to beginning
    data.stores.unshift(recentlyViewedStore);

    // Keep only MAX_STORES items
    if (data.stores.length > this.MAX_STORES) {
      data.stores = data.stores.slice(0, this.MAX_STORES);
    }

    this.saveRecentlyViewed(data);
  }

  /**
   * Clear all recently viewed data
   * This function can be replaced with an API call
   */
  clearRecentlyViewed(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed data:', error);
    }
  }

  /**
   * Clear recently viewed products only
   * This function can be replaced with an API call
   */
  clearRecentlyViewedProducts(): void {
    const data = this.getRecentlyViewed();
    data.products = [];
    this.saveRecentlyViewed(data);
  }

  /**
   * Clear recently viewed stores only
   * This function can be replaced with an API call
   */
  clearRecentlyViewedStores(): void {
    const data = this.getRecentlyViewed();
    data.stores = [];
    this.saveRecentlyViewed(data);
  }

  /**
   * Remove a specific product from recently viewed
   * This function can be replaced with an API call
   */
  removeRecentlyViewedProduct(documentId: string): void {
    const data = this.getRecentlyViewed();
    data.products = data.products.filter((p) => p.documentId !== documentId);
    this.saveRecentlyViewed(data);
  }

  /**
   * Remove a specific store from recently viewed
   * This function can be replaced with an API call
   */
  removeRecentlyViewedStore(businessId: string): void {
    const data = this.getRecentlyViewed();
    data.stores = data.stores.filter((s) => s.businessId !== businessId);
    this.saveRecentlyViewed(data);
  }
}
