import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Merchant, MerchantsStatus } from '../../sandbox/models/merchants.model';
import { BorderColorsEnum } from '@digipay/ngx-divider';

interface Tab {
  label: string;
  status: MerchantsStatus;
  emptyErrorMessage: {
    title: string;
    description: string;
  };
}

@Component({
  selector: 'app-home-status-tabs',
  templateUrl: './home-status-tabs.component.html',
  styleUrls: ['./home-status-tabs.component.scss']
})

export class HomeStatusTabsComponent implements OnInit, OnChanges {

  @Input() merchants: Merchant[] = [];

  @Output() continuedJourney: EventEmitter<string> = new EventEmitter();

  currentOption: number = 1;

  merchantCategories: { [key in MerchantsStatus]?: Merchant[] } = {};

  BorderColorsEnum = BorderColorsEnum;

  tabs: Tab[] = [
    {
      label: 'فعال',
      status: 1,
      emptyErrorMessage: {
        title: 'هنوز در طرحی ثبت‌نام نکرده اید.',
        description: ' با ثبت‌نام در طرح جدید درآمد حاصل از فروش خود را زودتر از همیشه دریافت کنید.'
      }
    },
    {
      label: 'در حال ثبت نام',
      status: 0,
      emptyErrorMessage: {
        title: 'هیچ ثبت‌نام تکمیل نشده ای ندارید.',
        description: ' با ثبت‌نام در طرح جدید درآمد حاصل از فروش خود را زودتر از همیشه دریافت کنید.'
      }
    }
  ];

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.merchants && changes.merchants.currentValue) {
      this.categoriesMerchants();
    }
  }

  categoriesMerchants(): void {
    this.merchantCategories = {};
    this.merchants.forEach(merchant => {
      this.merchantCategories[merchant.status] = this.merchantCategories[merchant.status] || [];
      this.merchantCategories[merchant.status]?.push(merchant);
    });
  }

  continueJourney(event: any) {
    this.continuedJourney.emit(event);
  }

  toggleTabs(option: any): void {
    this.currentOption = option;
  }

  showFactors() {
    const businessSettlementUrl = sessionStorage.getItem('businessSettlementUrl');
    if (businessSettlementUrl) {
      window.location.replace(businessSettlementUrl);
    }
  }

}
