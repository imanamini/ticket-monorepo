import { inject, Injectable, signal } from '@angular/core';
import { OverlayManagerConfig } from '../models/overlay-manager-config';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayManagerService<OutputType = any, InputType = any> {
  component = signal(null);
  config = signal<OverlayManagerConfig | undefined>(undefined);
  isVisible = signal(false);
  data = signal<InputType | null>(null);
  outputData = signal<OutputType | null>(null);
  router = inject(Router);
  onClose = new Subject();
  emittedValue = 0;
  routingSubscriber?: Subscription;

  displayOverlay(component: any, data: InputType, config: OverlayManagerConfig | null = null): Promise<OutputType | null> {
    this.outputData.set(null);
    this.data.set(data);
    this.component.set(component);
    this.isVisible.set(true);
    if (config) {
      this.config.set(config);
    }
    this.routingSubscriber?.unsubscribe();
    return new Promise<OutputType | null>((resolve) => {
      const onCloseSub = this.onClose.subscribe(() => {
        onCloseSub.unsubscribe();
        resolve(this.outputData());
      });
    });
  }

  closeOverlay(result: OutputType | null = null): void {
    this.routingSubscriber?.unsubscribe();
    this.outputData.set(result);
    setTimeout(() => {
      this.emittedValue++;
      this.onClose.next({ value: this.emittedValue });
    }, 100);
    setTimeout(() => {
      this.isVisible.set(false);
      this.data.set(null);
      this.config.set(undefined);
      this.component.set(null);
    }, 400);
  }
}
