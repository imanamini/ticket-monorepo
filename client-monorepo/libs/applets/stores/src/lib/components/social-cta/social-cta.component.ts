import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SocialCtaConfigModel } from '../../data-access/models/social-cta-config.model';
import { StoresApiService } from '@client-monorepo/stores';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { BottomSheetConfig } from '@digipay/ngx-bottom-sheet/lib/data-access/models/ngx-bottom-sheet-config';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SocialPaymentConfirmBottomSheetComponent } from '../social-payment-confirm-bottom-sheet/social-payment-confirm-bottom-sheet.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialService } from '@client-monorepo/social';
import { unsubscribe } from 'node:diagnostics_channel';

@Component({
  selector: 'stores-applet-social-cta',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './social-cta.component.html',
  styleUrl: './social-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialCtaComponent implements AfterViewInit {
  // Injections
  elRef = inject(ElementRef);
  storeApiService = inject(StoresApiService);
  router = inject(Router);
  messageService = inject(MessageService);
  bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);
  socialService = inject(SocialService);

  // Input
  config = input.required<SocialCtaConfigModel>();

  // Variables
  hostWidth = 0;
  secondaryBtnName = computed(() => (this.config().secondaryBtnName ? `${this.config().secondaryBtnName}` : 'پرداخت مبلغ'));
  goingToPay = signal<boolean>(false);

  ngAfterViewInit(): void {
    const hostElement = this.elRef.nativeElement as HTMLElement;
    this.hostWidth = hostElement.offsetWidth;
  }

  handleSendMessageButton(): void {
    if (!this.config()?.whatsappNumber) return;
    const base = 'https://app.mydigipay.com/stores/social/';
    const NL = String.fromCharCode(10) ?? '\n';
    const phoneNumber = this.formatPhoneNumber(this.config()!.whatsappNumber);
    const message =
      this.config().referrer === 'POST'
        ? 'سلام وقت بخیر' +
          NL +
          'کالای لینک زیر رو در دیجی‌پی مشاهده کردم و برای استعلام موجودی، قیمت محصول و هماهنگی خرید، پیام دادم خدمتتون.' +
          NL +
          base +
          'post/' +
          this.config()?.postId
        : 'سلام وقت بخیر' +
          NL +
          'صفحه شما رو در دیجی پی مشاهده کردم و برای راهنمایی بیشتر پیام دادم خدمتتون.' +
          NL +
          base +
          'store/' +
          this.config()?.storeTrackingCode;
    const encodedMessage = encodeURIComponent(message);
    this.socialService.sendClickEvent('stores-social-send-message-' + phoneNumber);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return '';
    const cleanPhone = phone.trim();
    if (cleanPhone.startsWith('0')) {
      return '+98' + cleanPhone.substring(1);
    }
    return cleanPhone;
  }

  openBottomSheet(): void {
    const config: BottomSheetConfig = {
      hasBackgroundColor: true,
      notCloseOnChangeRoute: false,
      noPadding: false,
      disableClose: false,
    };
    this.socialService.sendClickEvent('stores-social-payment-button-' + this.config()?.storeTrackingCode);
    this.bottomSheetService.openBottomSheet(SocialPaymentConfirmBottomSheetComponent, undefined, config);
    const closeSubscription = this.bottomSheetService.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        closeSubscription.unsubscribe();
        const data = this.bottomSheetService.outputData();
        if (data && data.button === 'BUY') {
          this.handlePaymentButtonClick();
        } else if (data && data.button === 'MESSAGE') {
          this.handleSendMessageButton();
        }
      },
    });
  }

  handlePaymentButtonClick(): void {
    const storeTrackingCode = this.config()?.storeTrackingCode;
    if (!storeTrackingCode) {
      return;
    }
    this.goingToPay.set(true);
    this.storeApiService.getMerchantUniqueId(storeTrackingCode).subscribe({
      next: (res) => {
        this.socialService.sendClickEvent('stores-social-payment-confirm-' + storeTrackingCode);
        this.router
          .navigate(['offline-payment/static'], {
            queryParams: { trackingCode: res.merchantUniqueId },
          })
          .then(() => {
            this.goingToPay.set(false);
          });
      },
      error: (err) => {
        this.messageService.showErrorOfErrorResponse(err);
        this.goingToPay.set(false);
      },
    });
  }
}
