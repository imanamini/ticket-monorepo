import { Injectable, signal } from '@angular/core';
import { PinConfigInterface } from '../models/pin-config.interface';
import { Subject } from 'rxjs';
import { PinStatus } from '@digipay/ngx-pin';

@Injectable({
  providedIn: 'root',
})
export class PinLayoutService {
  isVisible = signal(false);
  pinOverlayConfig = signal<PinConfigInterface | undefined>(undefined);
  outputData = signal<PinStatus | null>(null);
  onClose = new Subject();
  emittedValue = 0;

  public show(config: PinConfigInterface | undefined = {}) {
    this.outputData.set(null);
    this.pinOverlayConfig.set(config);
    this.isVisible.set(true);
  }

  public hide(result: PinStatus): void {
    this.outputData.set(result);
    setTimeout(() => {
      this.emittedValue++;
      this.onClose.next({ value: this.emittedValue });
    }, 100);
    setTimeout(() => {
      this.pinOverlayConfig.set(undefined);
      this.isVisible.set(false);
    }, 400);
  }
}
