import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditWalletDetailHeaderMenuDataItem, CreditWalletDetailHeaderMenuDataType } from './credit-wallet-detail-header-menu-data';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditWalletDetailHeaderMenuAgreementsComponent } from '../credit-wallet-detail-header-menu-agreements/credit-wallet-detail-header-menu-agreements.component';

@Component({
  selector: 'app-credit-wallet-detail-header-menu-bottom-sheet',
  templateUrl: './credit-wallet-detail-header-menu-bottom-sheet.component.html',
  styleUrls: ['./credit-wallet-detail-header-menu-bottom-sheet.component.scss'],
  standalone: true,
  imports: [CreditWalletDetailHeaderMenuAgreementsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailHeaderMenuBottomSheetComponent implements OnInit {
  items = signal<CreditWalletDetailHeaderMenuDataItem[] | null>(null);
  creditId = signal<string | null>(null);
  selectedItem = signal<CreditWalletDetailHeaderMenuDataType | null>(null);
  showAgreements: boolean;
  bottomSheet = inject(NgxBottomSheetService);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);

  constructor() {
    this.items.set(this.bottomSheet.data().items || []);
    this.creditId.set(this.bottomSheet.data().creditId);
    this.showAgreements = this.bottomSheet.data().showAgreements;
  }

  ngOnInit() {
    if (this.showAgreements) {
      this.onClick('SHOW_AGREEMENTS');
    }
  }

  goMainList() {
    this.selectedItem.set(null);
  }

  onClick(type: CreditWalletDetailHeaderMenuDataType) {
    switch (type) {
      case 'SHOW_PURCHASE_DETAILS':
        this.onPurchaseDetailHandler();
        break;
      case 'SHOW_AGREEMENTS':
        this.onContractsHandler();
        break;
    }
  }

  onPurchaseDetailHandler() {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet-transactions/${this.creditId()}`))
      .then(() => this.bottomSheet.closeBottomSheet());
  }

  onContractsHandler() {
    this.selectedItem.set('SHOW_AGREEMENTS');
  }
}
