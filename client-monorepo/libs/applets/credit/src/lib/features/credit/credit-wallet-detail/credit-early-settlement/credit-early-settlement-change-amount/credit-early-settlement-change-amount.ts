import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  CreditEarlySettlementChangeAmountHeaderComponent
} from '../credit-early-settlement-change-amount-header/credit-early-settlement-change-amount-header.component';
import {
  CreditEarlySettlementChangeAmountEditComponent
} from '../credit-early-settlement-change-amount-edit/credit-early-settlement-change-amount-edit.component';
import {
  CreditEarlySettlementChangeAmountViewComponent
} from '../credit-early-settlement-change-amount-view/credit-early-settlement-change-amount-view.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import {
  CreditEarlySettlementDetailResponse
} from '../../../data-access/models/credit/installment/credit-early-settlement-detail.response';

@Component({
  selector: 'app-credit-early-settlement-change-amount',
  standalone: true,
  imports: [
    CreditEarlySettlementChangeAmountHeaderComponent,
    CreditEarlySettlementChangeAmountEditComponent,
    CreditEarlySettlementChangeAmountViewComponent,
  ],
  templateUrl: './credit-early-settlement-change-amount.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementChangeAmountDialogComponent {
  amount = signal<number | null>(null);
  usedAmount = signal<number | null>(null);
  changeAmountView = signal<boolean>(false);
  bottomSheetService = inject(NgxBottomSheetService);
  data: CreditEarlySettlementDetailResponse;

  constructor() {
    this.data = this.bottomSheetService.data();
    this.amount.set(this.data.maxAmount ?? null);
    this.usedAmount.set(this.amount());
  }

  changeAmountOutput(editedAmount: number | null): void {
    if (editedAmount) {
      this.amount.set(editedAmount);
    }
    this.changeAmountView.set(false);
  }

  editAmountViewClick() {
    this.changeAmountView.set(true);
  }

  acceptAndPayClick(): void {
    this.bottomSheetService.outputData.set({ amount: this.amount() });
    this.bottomSheetService.closeBottomSheet();
  }
}
