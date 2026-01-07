import { inject } from '@angular/core';
import { DisasterLevelService, PerformanceTierService } from '@client-monorepo/common/utilities';
import { CampaignService } from '@client-monorepo/campaign';

export function performanceTierInitializer() {
  const performanceTireService = inject(PerformanceTierService);
  return async () => {
    try {
      await performanceTireService.setOrGetTier();
    } catch (error) {
      console.error('[APP_INIT] Performance tier initialization failed:', error);
    }
  };
}

export function checkDisasterLevel() {
  const disasterLevelService = inject(DisasterLevelService);
  return async () => {
    try {
      await disasterLevelService.checkDisasterLevelHeader();
    } catch (error) {
      // Completely suppress any errors from disaster level check
      // This is a non-critical feature and should not block app initialization
      console.error('[APP_INIT] Disaster level check failed:', error);
    }
  };
}

export function checkCampaignMode() {
  const campaignService = inject(CampaignService);
  return async () => {
    try {
      await campaignService.findActiveCampaign();
    } catch (error) {
      console.error('[APP_INIT] Campaign mode check failed:', error);
    }
  };
}
