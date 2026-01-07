import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-subscription-buy-pecuniary-confirm-bottom-sheet',
  templateUrl: './credit-subscription-buy-pecuniary-confirm-bottom-sheet.component.html',
  styleUrls: ['./credit-subscription-buy-pecuniary-confirm-bottom-sheet.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, ApiImageModule, NgxTrackableIdDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSubscriptionBuyPecuniaryConfirmBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  closeBottomSheet(): void {
    this.bottomSheetService.closeBottomSheet();
  }

  onConfirm(): void {
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.closeBottomSheet();
  }
}
