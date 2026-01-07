import { CommonModule } from '@angular/common';
import { IWalletInfo } from '../../models/wallet-info.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { PurchasePowerComponent } from '../purchase-power/purchase-power.component';
import { WalletBalanceInfoBottomsheetComponent } from '../wallet-balance-info-bottomsheet/wallet-balance-info-bottomsheet.component';

@Component({
  selector: 'wealth-applet-wallet-balance-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-balance-info.component.html',
  styleUrl: './wallet-balance-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceInfoComponent {
  walletInfo = input.required<IWalletInfo[]>();
  hasInfo = input<boolean>();

  description =
    signal<string>(`اگر تا ساعت ۱۴ روز کاری درخواست خود را ثبت کنید، مبلغ ثبت شده ۱ روز کاری بعد و درخواست پس از ساعت ۱۴ و یا در روز های تعطیل ۲
            روز کاری بعد به حساب متصل به سجامتان واریز خواهد شد.`);

  private bottomSheet = inject(NgxBottomSheetService);

  handleShowInfo(id: number) {
    if (id === 1) {
      this.showPurchasePowerInfo();
    } else {
      this.showWalletBalanceInfo();
    }
  }

  showPurchasePowerInfo() {
    this.bottomSheet.openBottomSheet(PurchasePowerComponent, {
      data: {
        image: 'wealth-assets/svg/purchase-power.svg',
        title: 'قدرت خرید شما شامل مبالغ حاصل از شارژ کیف پول،  اعتبار کارگزاری و فروش صندوق های ETF و سهام است.',
      },
    });
  }

  showWalletBalanceInfo() {
    this.bottomSheet.openBottomSheet(WalletBalanceInfoBottomsheetComponent, {
      data: {
        image: 'wealth-assets/svg/wallet-info.svg',
        title:
          'این موجودی ممکن است به دلیل در انتظار بودن مقداری از موجودی برای برداشت یا خرید، با قدرت خرید شما متفاوت باشد. می‌توانید این اطلاعات را در قسمت مبالغ در انتظار در سبد دارایی خود مشاهده کنید.',
      },
    });
  }
}
