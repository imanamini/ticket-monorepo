import { inject, Injectable } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ProfitOnboardingComponent } from '../components/profit-onboarding/profit-onboarding.component';
export const PROFIT_BOTTOM_SHEET = 'PROFIT_BOTTOM_SHEET';

@Injectable({
  providedIn: 'root',
})
export class OnboardingProfitService {
  private bottomSheet = inject(NgxBottomSheetService);

  checkProfitOnboard() {
    const itemStr = localStorage.getItem(PROFIT_BOTTOM_SHEET);
    try {
      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now > item.expiry) {
        this.onboardBottomsheet();
      }
    } catch (e) {
      this.onboardBottomsheet();
    }
  }

  private onboardBottomsheet() {
    this.bottomSheet.openBottomSheet(
      ProfitOnboardingComponent,
      {},
      {
        noPadding: true,
      },
    );
  }
}
