import { Component, effect, inject, input, signal } from '@angular/core';
import { ApiFile } from '../../../../../../api/clients/models/common/api-file';
import { LayoutService } from '../../../../../services/layout.service';
import { ScreenSize } from '../../../../../../api/digipay/models/common/screen-size';
import { SectionBanner } from '../../../../../../api/clients/models/templates/merchants-seller/merchants-seller-template-data';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-merchants-seller-banner-section',
  templateUrl: './merchants-seller-banner-section.component.html',
  styleUrls: ['./merchants-seller-banner-section.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
})
export class MerchantsSellerBannerSectionComponent {
  data = input<SectionBanner | undefined>();
  scrollToElementId = input<string | undefined>();
  banner = signal<ApiFile | undefined>(undefined);

  private router = inject(Router);
  private layout = inject(LayoutService);

  constructor() {
    effect(
      () => {
        this.layout.screenSizeChanged.subscribe((screenSize) => {
          const banner = screenSize === ScreenSize.isMobile ? this.data()?.mobileBanner : this.data()?.desktopBanner;
          this.banner.set(banner);
        });
      },
      { allowSignalWrites: true },
    );
  }

  goToGetLoan() {
    this.router.navigateByUrl('working-capital/kyb');
  }
}
