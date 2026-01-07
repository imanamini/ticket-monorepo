import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PROFIT_BOTTOM_SHEET } from '../../services/onboarding-profit.service';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'wealth-applet-profit-onboarding',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './profit-onboarding.component.html',
  styleUrl: './profit-onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitOnboardingComponent implements OnInit {
  private bottomSheet = inject(NgxBottomSheetService);

  ngOnInit(): void {
    const now = Date.now();
    const item = {
      expiry: now + 365 * 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(PROFIT_BOTTOM_SHEET, JSON.stringify(item));
  }

  gotIt() {
    this.bottomSheet.closeBottomSheet();
  }
}
