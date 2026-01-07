import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wealth-applet-get-credit-guids-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxCalloutComponent, NgxButtonComponent],
  templateUrl: './get-credit-guids-bottom-sheet.component.html',
  styleUrl: './get-credit-guids-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetCreditGuidsBottomSheetComponent {
  bottomSheet = inject(NgxBottomSheetService);

  steps = signal<any>([
    {
      number: 1,
      text: 'مبلغ دلخواهتان را به کیف ثروت واریز کنید.',
    },
    {
      number: 2,
      text: 'بعد از واریز، درخواست اعتبار دهید.',
    },
    {
      number: 3,
      text: 'منتظر نتیجه تخصیص اعتبار باشید.',
    },
    {
      number: 4,
      text: 'از اعتبار خود در فروشگاه‌های موجود در دیجی‌پی استفاده کنید.',
    },
  ]);

  gotIt() {
    this.bottomSheet.closeBottomSheet();
  }
}
