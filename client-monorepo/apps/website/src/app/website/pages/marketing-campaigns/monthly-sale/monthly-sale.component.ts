import {ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BaseLayoutComponent} from "../../../layout/base-layout/base-layout.component";
import {ContactForm} from "../../../../api/clients/models/templates/contact-us/contact-form";
import {ActivatedRoute} from "@angular/router";
import {PageDataService} from "../../../services/page-data.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MonthlySaleBannerComponent} from "./monthly-sale-banner/monthly-sale-banner.component";
import {HotSalesComponent} from "./hot-sales/hot-sales.component";
import {SalesFormComponent} from "./sales-form/sales-form.component";
import {SalePromotionComponent} from "./sale-promotion/sale-promotion.component";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../services/url.service";
import {CampaignTimerComponent} from "./campaign-timer/campaign-timer.component";

@Component({
  selector: 'app-monthly-sale',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, MonthlySaleBannerComponent, CampaignTimerComponent, HotSalesComponent, SalesFormComponent, SalePromotionComponent, NgxButtonComponent],
  templateUrl: './monthly-sale.component.html',
  styleUrl: './monthly-sale.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlySaleComponent implements OnInit {
  creditCampaignPage!: any;
  loaded = false;
  monthlySale = false;
  contactForm!: ContactForm;
  urlService = inject(UrlService);

  isMobileMode = false;

  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileMode = window.innerWidth <= 1280;
    }
    this.route.url.subscribe(segments => {
      if (segments[0].path === 'monthly-sale') {
        this.monthlySale = true;
      }
      this.pageDataService.getPageData('campaigns', segments[0].path).subscribe(res => {
        this.creditCampaignPage = res.page;
        this.contactForm = res.contactForms[0];
        this.loaded = true;
      });
    });
  }

  openLink(link: string) {
    this.urlService.handleLink(link);
  }
}
