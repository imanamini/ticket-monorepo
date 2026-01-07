import { Component, computed, Inject, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CreditRootStyleService } from '../../../shared/services/credit-root-style.service';
import { BnplPayFrictionComponent } from '../bnpl-pay-friction/bnpl-pay-friction.component';
import { InstallmentPreview } from '../../../api/purchase/credit-wallet.model';
import { CreditRouteStateInterface } from '../../../core/services/route-state/credit-route-state.interface';
import { isMobileOrTablet } from '../../../../utils/device';
import { NgClass } from '@angular/common';
import { CancelService } from '../../../shared/services/cancel.service';

@Component({
  selector: 'app-bnpl-pay-without-cash',
  standalone: true,
  imports: [
    BnplPayFrictionComponent,
    NgClass
  ],
  templateUrl: './bnpl-pay-without-cash.component.html',
  styleUrl: './bnpl-pay-without-cash.component.scss'
})
export class BnplPayWithoutCashComponent implements OnInit, OnDestroy {

  amount = input<number>(0);
  installments = input<InstallmentPreview[]>(null);
  onPay = output();
  isDesktop = signal<boolean>(false);

  installmentEffectiveDate = computed(() => this.installments()?.[0]?.date);

  private StyleService = inject(CreditRootStyleService);
  private cancelService = inject(CancelService);

  ngOnInit() {
    this.isDesktop.set(!isMobileOrTablet());
    this.StyleService.setBackgroundColor('#F2F5F8');
  }

  ngOnDestroy() {
    this.StyleService.setBackgroundColor('');
  }

  backHandler() {
    this.cancelService.confirmBottomSheet();
  }
}
