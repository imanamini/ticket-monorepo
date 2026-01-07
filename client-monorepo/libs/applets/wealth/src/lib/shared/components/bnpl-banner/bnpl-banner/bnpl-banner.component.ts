import { Component, input } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'wealth-applet-bnpl-banner',
  standalone: true,
  imports: [NgxButtonComponent, NgxDividerComponent, NgxIcon, NgxBadgeModule],
  templateUrl: './bnpl-banner.component.html',
  styleUrl: './bnpl-banner.component.scss',
})
export class BnplBannerComponent {
  bnplTitle = input<string>('');
  displayFee = input<boolean>();
  fee = input<number>(0);
  bnplDescription = input<string>('');
  bnplHasAction = input<boolean>();
  bnplWallet = input<boolean>();
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
