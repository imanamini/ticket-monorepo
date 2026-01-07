import { Inject, Injectable } from '@angular/core';

declare const L: any;
type CreateTileFunction = (this: L.TileLayer, coords: L.Coords, done: (error: any, tile: HTMLImageElement) => void) => HTMLImageElement;

@Injectable()
export class LeafletHeaderService {
  private initialized = false;
  private apiKey = '';

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.apiKey = environment['mapIrKey'];
  }

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // Cast to any so we can override a "protected" method.
    const tileProto = L.TileLayer.prototype as any;
    const originalCreateTile = tileProto.createTile as CreateTileFunction;
    const _apiKey = this.apiKey;

    tileProto.createTile = function (coords: L.Coords, done: (error: any, tile: HTMLImageElement) => void): HTMLImageElement {
      const tileElement = document.createElement('img');
      tileElement.alt = '';
      tileElement.setAttribute('role', 'presentation');
      const tileUrl: string = this.getTileUrl(coords);
      if (!tileUrl.startsWith('https://map.ir/shiveh')) {
        return originalCreateTile.call(this, coords, done);
      }
      fetch(tileUrl, {
        headers: { 'x-api-key': _apiKey },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok for ${tileUrl}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          tileElement.src = objectUrl;
          done(null, tileElement);
        })
        .catch((err) => {
          console.error('Error loading tile with custom header:', err);
          done(err, tileElement);
        });

      return tileElement;
    };
  }
}
