import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'stores-applet-qr-shopping-guide',
  standalone: true,
  imports: [CommonModule, NgxCalloutComponent],
  templateUrl: './qr-shopping-guide.component.html',
  styleUrl: './qr-shopping-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrShoppingGuideComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  isOpen = input<boolean>(false);
  componentId = input<string>('');

  messages = [
    'مشاهده آدرس فروشگاه و مراجعه حضوری',
    'انتخاب اقلام مورد نظر ',
    'اعلام شماره موبایل به فروشنده',
    'اسکن کیوآرکد روی فاکتور خرید با بارکد‌خوان دیجی‌پی',
    'انتخاب گزینه پرداخت اعتباری با دیجی‌پی',
  ];
}
