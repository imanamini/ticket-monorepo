import { inject, Injectable } from '@angular/core';
import { convertWalletGtmToPillar, WALLET_GTM_TAG } from '../consts/payment-wallet-gtm';
import { AppNameService, StorageService } from '@client-monorepo/common/utilities';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Injectable({
  providedIn: 'root',
})
export class WalletGtmService {
  private readonly eventService = inject(NgxEventTrackerService);
  private readonly storageService = inject(StorageService);
  private readonly appName = inject(AppNameService);

  publishEvent(event: WALLET_GTM_TAG | string, eventData?: any): void {
    const userId = this.storageService.getUserId();
    const eventName = this.appName.isPillar() ? convertWalletGtmToPillar(event) : event;
    let data: any = { user_id: userId };

    if (eventData) {
      data = { ...data, ...eventData };
    }

    this.eventService.sendEvent(
      {
        eventName,
        eventData: data,
      },
      { platforms: ['gtm'] },
    );
  }
}
