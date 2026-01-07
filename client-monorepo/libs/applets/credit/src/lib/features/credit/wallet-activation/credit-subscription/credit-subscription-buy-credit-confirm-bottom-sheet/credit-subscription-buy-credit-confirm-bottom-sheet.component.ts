import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { SubscriptionDetail } from '../../../data-access/models/credit/activation/subscription/subscription-status.response';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'app-credit-subscription-buy-credit-confirm-bottom-sheet',
  templateUrl: './credit-subscription-buy-credit-confirm-bottom-sheet.component.html',
  styleUrls: ['./credit-subscription-buy-credit-confirm-bottom-sheet.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, ApiImageModule, NgxTrackableIdDirective, PipesModule, NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionBuyCreditConfirmBottomSheetComponent implements OnInit {
  subscriptionDetails = signal<SubscriptionDetail | undefined>(undefined);
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.subscriptionDetails.set(this.bottomSheetService.data());
  }

  closeBottomSheet(): void {
    this.bottomSheetService.closeBottomSheet();
  }

  onConfirm(): void {
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.closeBottomSheet();
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
