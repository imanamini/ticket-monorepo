import { Component, inject, input } from '@angular/core';

import { IIPOLandingBanner } from '../../models/ipo-landing-banner.interface';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { ImageComponent } from '../../../../shared/components/image/image.component';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IPO_ROUTE } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-ipo-banner',
  standalone: true,
  imports: [NgxBadgeModule, NgxIcon, ImageComponent],
  templateUrl: './ipo-banner.component.html',
  styleUrl: './ipo-banner.component.scss',
})
export class IpoBannerComponent {
  banner = input<IIPOLandingBanner>();
  private navigationService = inject(WealthNavigationService);

  onClick() {
    this.navigationService.navigate([IPO_ROUTE, this.banner().symbol]);
  }
}
