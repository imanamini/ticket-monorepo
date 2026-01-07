import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditNoticesComponent } from '../../../components/credit-notices/credit-notices.component';

@Component({
  selector: 'app-credit-cheque-notices-bottom-sheet',
  templateUrl: './credit-cheque-notices-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-notices-bottom-sheet.component.scss'],
  imports: [NgxButtonComponent, NgxTrackableIdDirective, CreditNoticesComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeNoticesBottomSheetComponent {
  notices = [
    'چک را <b>بر اساس راهنما</b> بنویسید و از نوشتن اطلاعات اضافه‌تر بر رو و پشت آن خودداری کنید.',
    'چک باید کاملا <b>سالم و بدون پارگی</b> باشد همچنین شماره شعبه و شناسه صیاد آن <b>مخدوش</b> نباشد.',
    'چک را تنها با <b>یک رنگ خودکار</b> (آبی یا مشکی) بنویسید.',
    'از <b>خط‌خوردگی و پررنگ نویسی</b> خودداری کنید.',
    'به چک <b>چسب</b> نزنید و از <b>هایلایت کردن</b> خودداری کنید.',
    'از نوشتن <b>خط ممتد (-)</b> به جای <b>رقم صفر (۰)</b> و معادل‌سازی <b>ریال به تومان</b> خودداری کنید.',
  ];

  private bottomSheetService = inject(NgxBottomSheetService);

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
