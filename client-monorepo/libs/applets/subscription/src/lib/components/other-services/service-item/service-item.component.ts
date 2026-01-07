import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { UiStatusComponent } from '../../ui-status/ui-status/ui-status.component';
import { NgTemplateOutlet } from '@angular/common';
import { formatPriceToString } from '@client-monorepo/common/utilities';

@Component({
  selector: 'subscription-applet-service-item',
  templateUrl: './service-item.component.html',
  standalone: true,
  styleUrls: ['./service-item.component.scss'],
  imports: [UiStatusComponent, NgTemplateOutlet],
})
export class ServiceItemComponent implements OnChanges {
  @Input() service!: PlanServices;

  @Output() selectService = new EventEmitter();

  @Input() template!: TemplateRef<any | null> | null;

  serviceConfig: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['service']?.currentValue?.type !== changes?.['service']?.previousValue?.type) {
      this.generateServiceConfig();
    }
  }

  generateServiceConfig() {
    let config;
    switch (this.service.type) {
      case SERVICES_TYPE.COIN:
        config = {
          ...this.service,
          title: 'پی‌کلاب',
          subtitle: `${this.service.amount} سکه‌ی پی‌کلاب`,
          icon: 'assets/subscription/icons/services/coin-fill.svg',
          hasDetail: true,
          hasStatus: true,
        };
        break;
      case SERVICES_TYPE.PURCHASE_CASHBACK:
        config = {
          ...this.service,
          title: `پرداخت‌های کیف‌پولی یا دیجی‌کارت`,
          subtitle: `برگشت ‌پول تا سقف ${formatPriceToString(+this.service.maxCashbackPerPlan)}`,
          icon: 'assets/subscription/icons/services/store-fill.svg',
          hasDetail: false,
          hasStatus: false,
        };
        break;
      case SERVICES_TYPE.CASHBACK:
        config = {
          ...this.service,
          title: `خرید شارژ و بسته اینترنت`,
          subtitle: 'برگشت ‌پول تا سقف ۳۰۰ هزار تومان',
          icon: 'assets/subscription/icons/services/cashback-fill.svg',
          hasDetail: false,
          hasStatus: false,
        };
        break;
    }
    this.serviceConfig = config;
  }

  clickServiceDetail() {
    this.selectService.emit();
  }
}
