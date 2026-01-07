import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'stores-applet-social-shopping-guide',
  standalone: true,
  imports: [CommonModule, LottieComponent, NgxAppBarComponent, NgxIcon, NgxCalloutComponent],
  templateUrl: './social-shopping-guide.component.html',
  styleUrl: './social-shopping-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class SocialShoppingGuideComponent implements OnInit, OnDestroy {
  // Injections
  backHandler = inject(BackHandlerService);
  bottomNavigationService = inject(NgxBottomNavigationService);

  // Variables
  animationOptions = { path: 'assets/shared/stores/social/user-guides.json', loop: true, autoplay: true };
  calloutMessages = [
    'انتخاب محصول مورد نظر از طریق صفحه‌ی فروشگاه در دیجی‌پی یا از طریق صفحه‌ی فروشگاه در اینستاگرام',
    'اطلاع از موجودی و قیمت کالا و هماهنگی از طریق ارسال پیام به فروشنده',
    'کلیک روی دکمه پرداخت مبلغ در صفحه فروشنده دیجی‌پی و وارد کردن مبلغ نهایی',
    'انتخاب روش پرداخت و ارسال رسید به فروشنده',
  ];

  ngOnInit(): void {
    this.bottomNavigationService.hide();
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
}
