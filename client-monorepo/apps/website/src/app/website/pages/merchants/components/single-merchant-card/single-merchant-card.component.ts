import {Component, inject, Inject, Input, PLATFORM_ID} from '@angular/core';
import {MerchantTypeDialog, SingleMerchant} from '../../../../../api/digipay/models/merchants/single-merchant.model';
import {STORE_TYPES, STORE_TYPES_SHORT_TRANSLATION} from '../../../../../api/digipay/models/merchants/store-types';
import {
  STORE_PROVIDERS,
  STORE_PROVIDERS_TRANSLATION
} from '../../../../../api/digipay/models/merchants/store-providers';
import {DialogBottomSheetService} from '../../../../../core/services/dialog-bottom-sheet.service';
import {MerchantTypeDialogComponent} from './merchant-type-dialog/merchant-type-dialog.component';
import {
  MerchantPurchaseInfoDialogComponent
} from './merchant-purchase-info-dialog/merchant-purchase-info-dialog.component';
import {environment} from '../../../../../../environments/environment';
import {isPlatformBrowser, NgClass, NgFor, NgIf} from '@angular/common';
import {UiIconDirective} from '../../../../../ui/ui-directive/ui-icon.directive';
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-single-merchant-card',
  templateUrl: './single-merchant-card.component.html',
  styleUrls: ['./single-merchant-card.component.scss'],
  standalone: true,
  imports: [NgIf, UiIconDirective, NgClass, NgFor],
})
export class SingleMerchantCardComponent {
  @Input()
  merchant: SingleMerchant;

  protected readonly STORE_TYPES_SHORT_TRANSLATION = STORE_TYPES_SHORT_TRANSLATION;

  protected readonly STORE_PROVIDERS_TRANSLATION = STORE_PROVIDERS_TRANSLATION;

  protected readonly STORE_PROVIDERS = STORE_PROVIDERS;

  protected readonly STORE_TYPES = STORE_TYPES;

  protected readonly environment = environment;

  onlineTypeDialogData: MerchantTypeDialog = {
    title: 'آنلاین: ',
    description: 'فروشگاه‌های اینترنتی که با مراجعه به وبسایت و ثبت سفارش خود، میتوانید از آنها خرید کنید',
    steps: [
      {
        name: 'انتخاب فروشگاه از صفحه ی فروشگاه ها',
        imagePath: 'assets/stores-db/store-dialog/select-merchant.svg',
      },
      {
        name: 'سفارش و تکمیل خرید',
        imagePath: 'assets/stores-db/store-dialog/green-cart.svg',
      },
      {
        name: 'پرداخت از طریق گزینه‌های خرید اعتباری',
        imagePath: 'assets/stores-db/store-dialog/pay-by-credit.svg',
      },
    ],
  };

  onsiteTypeDialogData: MerchantTypeDialog = {
    title: 'آفلاین(حضوری): ',
    description: 'فروشگاه‌هایی که برای خرید از آنها حتما نیاز به مراجعه حضوری به شعب و یا یک شعبه‌ی خاص از فروشگاه دارید.',
    steps: [
      {
        name: 'مشاهده آدرس فروشگاه و مراجعه حضوری',
        imagePath: 'assets/stores-db/store-dialog/onsite-shopping.svg',
      },
      {
        name: 'سفارش و تکمیل خرید',
        imagePath: 'assets/stores-db/store-dialog/green-cart.svg',
      },
      {
        name: 'اسکن بارکد فاکتور در بخش بارکد دیجی پی',
        imagePath: 'assets/stores-db/store-dialog/scan-barcode.svg',
      },
      {
        name: 'پرداخت از طریق گزینه‌های خرید اعتباری',
        imagePath: 'assets/stores-db/store-dialog/pay-by-credit.svg',
      },
    ],
  };
  urlService = inject(UrlService);

  constructor(private dialogService: DialogBottomSheetService) {
  }

  handleClickPurchaseInfo() {
    if (this.merchant.type.includes(STORE_TYPES.ONSITE)) {
      this.dialogService.open(MerchantPurchaseInfoDialogComponent, {
        merchantInfo: this.merchant,
        width: '526px',
      });
    } else {
      this.urlService.handleLink(this.merchant.website);
    }
  }

  openMerchantTypeDialog(merchantTypes: STORE_TYPES[]) {
    this.dialogService.open(MerchantTypeDialogComponent, {
      typeDialogData: merchantTypes.includes(STORE_TYPES.ONSITE) ? this.onsiteTypeDialogData : this.onlineTypeDialogData,
      width: '526px',
    });
  }
}
