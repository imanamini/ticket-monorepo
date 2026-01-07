import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { SERVICE_STATUS, SERVICES_TYPE } from '@client-monorepo/common/subscription';

@Component({
  selector: 'subscription-applet-section-title',
  standalone: true,
  imports: [NgClass],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss',
})
export class SectionTitleComponent implements OnInit {
  @Input() description!: string | undefined;
  @Input() status!: number;
  @Input() nextActionUrl!: string | undefined;
  @Input() hasAction = true;
  @Input() hasStaticIcon = false;
  @Input() hasDescription = false;
  @Input() type!: number;

  @Output() nextActionClicked = new EventEmitter<string>();

  config: any;

  ICON_MAPPER: { [key: string]: string } = {
    [SERVICE_STATUS.IN_PROGRESS]: 'is-progress',
    [SERVICE_STATUS.REJECTED]: 'is-rejected',
  };

  ngOnInit() {
    this.generateServiceConfig();
  }

  onNextActionClicked() {
    this.nextActionClicked.emit(this.nextActionUrl);
  }

  generateServiceConfig() {
    let config: { title: string; icon: string; description?: string } | undefined;
    switch (this.type) {
      case SERVICES_TYPE.DPCARD_ISUUANCE:
        config = {
          title: 'دیجی‌کارت',
          description: ' با دیجی‌کارت، علاوه بر امکانات کیف پول می‌توانید به صورت حضوری هم خرید کنید.',
          icon: 'assets/subscription/icons/services/dp-card-fill.svg',
        };
        break;
      case SERVICES_TYPE.CREDIT:
        config = {
          title: 'دریافت وام',
          description: 'برای دریافت وام، مراحل اخذ وام را آغاز فرمایید.',
          icon: 'assets/subscription/icons/services/credit-fill.svg',
        };
        break;
      case SERVICES_TYPE.BNPL_1PAY:
      case SERVICES_TYPE.BNPL_4PAY:
        config = {
          title: 'الان بخر، بعدا پرداخت کن!',
          icon: 'assets/subscription/icons/services/bnpl-fill.svg',
        };
        break;
    }
    this.config = config;
  }
}
