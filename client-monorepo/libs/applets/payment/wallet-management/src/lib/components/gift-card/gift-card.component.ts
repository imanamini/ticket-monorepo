import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AddGiftCardComponent } from './add-gift-card/add-gift-card.component';
import { GiftInformationSkeletonStyleConst } from './gift-information/gift-information-skeleton-style.const';
import { VoucherDetail } from '../../data-access/models/voucher.response.interface';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { GiftInformationComponent } from './gift-information/gift-information.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'wallet-mng-applet-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxButtonComponent, GiftInformationComponent, SkeletonComponent, NgForOf, NgIf],
  standalone: true,
})
export class GiftCardComponent {
  public giftInformationSkeletonStyleConst = GiftInformationSkeletonStyleConst;
  public gettingData = true;
  private bottomSheet = inject(NgxBottomSheetService);
  private readonly gtmService = inject(WalletGtmService);
  vouchers = input.required<VoucherDetail[]>();

  public openGiftCardBottomSheet(): void {
    this.bottomSheet.openBottomSheet(AddGiftCardComponent, {});
    this.gtmService.publishEvent(WALLET_GTM_TAG.WALLET_MNG_GIFT);
  }
}
