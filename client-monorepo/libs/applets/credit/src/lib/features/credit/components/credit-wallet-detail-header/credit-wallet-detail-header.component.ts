import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { luminance } from '../../data-access/utils/colors';
import { CreditExternalService } from '../../data-access/services/credit-external.service';
import { Subscription } from 'rxjs';
import { CreditWalletDetailHeaderMenuBottomSheetComponent } from './credit-wallet-detail-header-menu-bottom-sheet/credit-wallet-detail-header-menu-bottom-sheet.component';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { CreditWalletDetailHeaderMenuDataItem } from './credit-wallet-detail-header-menu-bottom-sheet/credit-wallet-detail-header-menu-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-wallet-detail-header',
  templateUrl: './credit-wallet-detail-header.component.html',
  styleUrls: ['./credit-wallet-detail-header.component.scss'],
  standalone: true,
  imports: [PipesModule, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailHeaderComponent implements OnInit, OnChanges, OnDestroy {
  color = input<string>();

  balance = input<number>();

  rightLabel = input<string>();

  rightValue = input<string>();

  leftLabel = input<string>();

  leftValue = input<string>();

  collapse = input<boolean>();

  title = input<string>();

  creditId = input<string>();

  serviceType = input<SERVICE_TYPE>();

  showAgreements = input<boolean>();

  closeClick = output();

  mode = signal<'light' | 'dark' | null>(null);

  serviceTypeName = computed(() => (this.serviceType() === SERVICE_TYPE.BNPL ? 'اعتبار اقساطی' : 'وام'));

  externalGoBackSubscription!: Subscription;
  externalHideTitleSubscription!: Subscription;

  hideTitle = signal<boolean | null>(null);
  showMenuButton = signal<boolean | null>(null);
  menu!: CreditWalletDetailHeaderMenuDataItem[];

  bottomSheet = inject(NgxBottomSheetService);
  creditExternalService = inject(CreditExternalService);

  ngOnInit(): void {
    this.setMode();
    this.makeMenu();
    this.externalGoBackSubscription = this.creditExternalService.goBack.subscribe(() => {
      this.onCloseClick();
    });
    this.externalHideTitleSubscription = this.creditExternalService.hideTitle.subscribe((value) => {
      this.hideTitle.set(value);
    });
    if (this.showAgreements()) {
      this.openMenu(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      this.creditExternalService.creditTitle.next(this.title()!);
    }
  }

  setMode(): void {
    this.mode.set(luminance(this.color()!) > 0.25 ? 'light' : 'dark');
  }

  makeMenu() {
    this.showMenuButton.set(this.serviceType() === SERVICE_TYPE.CREDIT || this.serviceType() === SERVICE_TYPE.INSTALLMENT_SALE);

    switch (this.serviceType()) {
      case SERVICE_TYPE.INSTALLMENT_SALE:
        this.menu = [
          { type: 'SHOW_PURCHASE_DETAILS', title: 'تاریخچه خرید' },
          { type: 'SHOW_AGREEMENTS', title: 'لیست قراردادها' },
        ];
        break;
      case SERVICE_TYPE.CREDIT:
        this.menu = [{ type: 'SHOW_PURCHASE_DETAILS', title: 'تاریخچه خرید' }];
        break;
      default:
        this.menu = [];
    }
  }

  onCloseClick(): void {
    this.closeClick.emit();
  }

  ngOnDestroy(): void {
    if (this.externalHideTitleSubscription) {
      this.externalHideTitleSubscription.unsubscribe();
    }
    if (this.externalGoBackSubscription) {
      this.externalGoBackSubscription.unsubscribe();
    }
  }

  openMenu(showAgreements?: boolean) {
    this.bottomSheet.openBottomSheet(
      CreditWalletDetailHeaderMenuBottomSheetComponent,
      {
        items: this.menu,
        creditId: this.creditId(),
        showAgreements: showAgreements!,
      },
      {
        noPadding: true,
      },
    );
  }
}
