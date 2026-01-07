import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'stores-applet-online-shopping-guide',
  standalone: true,
  imports: [CommonModule, NgxCalloutComponent],
  templateUrl: './online-shopping-guide.component.html',
  styleUrl: './online-shopping-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineShoppingGuideComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  isOpen = input<boolean>(false);
  componentId = input<string>('');

  messages = ['انتخاب فروشگاه از صفحه فروشگاه‌ها', 'سفارش و تکمیل سبد خرید', 'انتخاب گزینه پرداخت اعتباری دیجی‌پی'];
}
