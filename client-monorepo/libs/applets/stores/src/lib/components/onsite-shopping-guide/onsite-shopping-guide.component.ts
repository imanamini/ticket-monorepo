import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'stores-applet-onsite-shopping-guide',
  standalone: true,
  imports: [CommonModule, NgxCalloutComponent],
  templateUrl: './onsite-shopping-guide.component.html',
  styleUrl: './onsite-shopping-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnsiteShoppingGuideComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  isOpen = input<boolean>(false);
  componentId = input<string>('');

  messages = [
    'مشاهده آدرس فروشگاه و مراجعه حضوری',
    'انتخاب اقلام مورد نظر',
    'اطمینان از متصل بودن کارت بانکی به اعتبار دیجی‌پی',
    'کشیدن کارت روی کارت‌خوان مخصوص دیجی‌پی',
    'انتخاب گزینه پرداخت اعتباری دیجی‌پی',
  ];
}
