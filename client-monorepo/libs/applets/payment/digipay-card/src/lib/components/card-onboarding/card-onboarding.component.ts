import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'digipay-card-applet-card-onboarding',
  templateUrl: './card-onboarding.component.html',
  styleUrls: ['./card-onboarding.component.scss'],
  standalone: true,
  imports: [NgxAppBarComponent, TitleSummaryComponent, NgxCalloutComponent, NgxButtonComponent],
})
export class CardOnboardingComponent implements OnInit {
  storageService = inject(StorageService);
  router = inject(Router);
  calloutMessages = [
    'استفاده از موجودی کیف‌پول در کلیه فروشگاه‌های کشور',
    'امکان استفاده حداکثری از برنامه‌های وفاداری و اشتراک‌ها',
    'بهره‌مندی اختصاصی از مزایا و کمپین‌های ویژه',
    'امکان خرید از فروشگاه‌های حضوری از طریق وام و اعتبار (به‌زودی)',
  ];

  ngOnInit(): void {
    if (this.storageService.isDigipayCardOnboardingChecked()) {
      this.router.navigate(['/card/issuance']);
    }
  }

  onComplete() {
    this.storageService.storeDigipayCardOnboardingChecked();
    this.router.navigate(['/card/issuance']);
  }

  goBack() {
    this.router.navigate(['/transactions']);
  }
}
