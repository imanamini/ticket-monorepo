import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { OrderOverviewComponent } from '../../components/order-overview/order-overview.component';
import { AmountInputComponent } from '../../components/amount-input/amount-input.component';
import { OnboardingComponent } from '../../components/onboarding/onboarding.component';
import { OrderMediatorService } from '../../data-access/services/order-mediator.service';
import { PayErrorComponent } from '../../components/pay-error/pay-error.component';
import { Subscription } from 'rxjs';
import { OrderResponse } from '../../data-access/models/order.interface';
import { ConfirmToPayComponent } from '../../components/confirm-to-pay/confirm-to-pay.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-purchase-flow-applet-enter-price',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, OrderOverviewComponent, AmountInputComponent, PayErrorComponent, NgxButtonComponent],
  templateUrl: './enter-amount.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterAmountComponent implements OnInit, OnDestroy {
  orderMediatorService = inject(OrderMediatorService);
  bottomSheetService = inject(NgxBottomSheetService);
  storageService = inject(EscrowStorageService);
  agreedAmount!: string | null;
  isAmountValid = signal<boolean>(false);
  showPayError = signal(false);
  bottomSheetSubscription: Subscription | undefined;

  get order(): OrderResponse | null {
    return this.orderMediatorService.order();
  }

  ngOnInit() {
    this.openOnBoardingBottomSheet();
    this.bottomSheetSubscription = this.bottomSheetService.onClose.subscribe(() => {
      const output = this.bottomSheetService.outputData();
      this.showPayError.set(output);
    });
  }

  getPrice(amount: { valid: boolean; value: string | null }) {
    this.isAmountValid.set(amount.valid);
    this.agreedAmount = amount.value;
  }

  openOnBoardingBottomSheet() {
    if (!this.storageService.getEscrowBottomSheetOnboarding()) {
      this.bottomSheetService.openBottomSheet(OnboardingComponent, {});
    }
  }

  openConfirmToPayBottomSheet() {
    this.bottomSheetService.openBottomSheet(ConfirmToPayComponent, { amount: this.agreedAmount });
  }

  ngOnDestroy() {
    this.bottomSheetSubscription?.unsubscribe();
  }
}
