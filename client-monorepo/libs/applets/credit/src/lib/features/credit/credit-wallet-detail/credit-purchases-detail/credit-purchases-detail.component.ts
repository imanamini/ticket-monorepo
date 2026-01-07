import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
  untracked,
} from '@angular/core';
import { ContractPurchasesResponse } from '../../data-access/models/credit/installment/contract-purchases.response';
import { ContractPurchaseGroup } from '../../data-access/models/credit/installment/contract-purchase-group';
import { CreditDigipayImageComponent } from '../../components/credit-digipay-image/credit-digipay-image.component';
import { CreditPurchaseGroupDetailComponent } from './credit-purchase-group-detail/credit-purchase-group-detail.component';
import { CreditPurchaseGroupCardComponent } from './credit-purchase-group-card/credit-purchase-group-card.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-purchases-detail',
  templateUrl: './credit-purchases-detail.component.html',
  styleUrls: ['./credit-purchases-detail.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditPurchaseGroupCardComponent,
    CreditPurchaseGroupDetailComponent,
    CreditDigipayImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPurchasesDetailComponent implements OnInit, OnChanges {
  data = input<ContractPurchasesResponse>();
  pageUrl = input<string>();
  selectedGroup = signal<ContractPurchaseGroup | null>(null);
  messageMode = signal(false);

  back = output<void>();

  constructor() {
    effect(
      () => {
        const data = this.data();
        if (data) {
          untracked(() => this.initData());
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initData();
    }
  }

  initData(): void {
    if (!this.data()) {
      this.selectedGroup.set(null);
      return;
    }
    this.messageMode.set(!!this.data()?.message);
    if (this.messageMode()) {
      return;
    }
    if (this.data()?.businessTransactionDetails?.length === 1) {
      this.selectedGroup.set(this.data()!.businessTransactionDetails![0]);
    }
  }

  goBack() {
    if (this.data()?.businessTransactionDetails && this.data()!.businessTransactionDetails!.length > 1 && this.selectedGroup()) {
      this.selectedGroup.set(null);
      return;
    }
    this.back.emit();
  }
}
