import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadImageServices {
  private  imageCache = new Map<string, string>();
  public set(imageId: string, url: string): void {
    this.imageCache.set(imageId, url);
  }

  public get(imageId: string): string {
    return this.imageCache.get(imageId);
  }

  public has(imageId: string): boolean {
    return this.imageCache.has(imageId);
  }
}
