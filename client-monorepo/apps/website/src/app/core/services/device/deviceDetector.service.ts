import {afterNextRender, computed, inject, Inject, Injectable, NgZone, PLATFORM_ID, signal} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})

export class DeviceDetectorService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private hydrated = signal(false);
  private mobile = signal(false);

  readonly isReady = computed(() => this.hydrated());
  readonly isMobile = computed(() => this.mobile());

  constructor() {
    if (!this.isBrowser) return;

    afterNextRender(() => {
      const media = window.matchMedia('(max-width: 1280px)');

      this.mobile.set(media.matches);
      this.hydrated.set(true);

      media.addEventListener('change', e => {
        this.mobile.set(e.matches);
      });
    });
  }
  isMobileDevice() {
    return this.isMobile();
  }
}
