import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CreditVideoPlayerDialogComponent } from '../../../../components/credit-video-player-dialog/credit-video-player-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditNoticesComponent } from '../../../../components/credit-notices/credit-notices.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-cheque-step-notices',
  templateUrl: './credit-cheque-step-notices.component.html',
  styleUrls: ['./credit-cheque-step-notices.component.scss'],
  imports: [NgxButtonComponent, NgxTrackableIdDirective, CreditNoticesComponent, CreditAppBarComponent, CreditScrollableViewComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepNoticesComponent {
  notices = [
    'چک را <b>بر اساس راهنما</b> بنویسید و از نوشتن اطلاعات اضافه‌تر بر رو و پشت آن خودداری کنید.',
    'چک باید کاملا <b>سالم و بدون پارگی</b> باشد همچنین شماره شعبه و شناسه صیاد آن <b>مخدوش</b> نباشد.',
    'چک را تنها با <b>یک رنگ خودکار</b> (آبی یا مشکی) بنویسید.',
    'از <b>خط‌خوردگی و پررنگ نویسی</b> خودداری کنید.',
    'به چک <b>چسب</b> نزنید و از <b>هایلایت کردن</b> خودداری کنید.',
    'از نوشتن <b>خط ممتد (-)</b> به جای <b>رقم صفر (۰)</b> و معادل‌سازی <b>ریال به تومان</b> خودداری کنید.',
  ];
  isInstallment = input<boolean>(true);

  nextStep = output();
  prevStep = output();
  bottomSheetService = inject(NgxBottomSheetService);

  openGuideVideoDialog() {
    this.bottomSheetService.openBottomSheet(
      CreditVideoPlayerDialogComponent,
      {
        videoUrl: 'https://www.mydigipay.com/api/website/proxy/get-file/public/2024/01/81e4031f-4e13-4a14-87c3-c246dfa36833.MP4',
      },
      {
        height: '50%',
      },
    );
  }
}
