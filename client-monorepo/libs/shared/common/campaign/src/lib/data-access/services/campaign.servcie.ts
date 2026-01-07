import { Injectable, signal } from '@angular/core';
import { CampaignConfig } from '../models/campaign-config';
import { BlackFridayConfig } from '../models/black-friday';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  isActive = signal(false);
  activeCampaign = signal<CampaignConfig | undefined>(undefined);
  campaigns = [BlackFridayConfig];

  findActiveCampaign(): Promise<void> {
    try {
      const timeNow = new Date().getTime();
      for (const campaign of this.campaigns) {
        if (campaign.startDate < timeNow && campaign.endDate > timeNow) {
          this.activeCampaign.set(campaign);
          this.isActive.set(true);
        }
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }

  public static isAuctionMode(): boolean {
    if (process.env['name'] === 'staging' && new Date().getTime() < 1766348999000) {
      return true;
    }
    return 1766348999000 < new Date().getTime() && new Date().getTime() < 1766780999000;
  }
}
