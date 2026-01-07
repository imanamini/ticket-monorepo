import { Component, Input, OnInit } from '@angular/core';
import { CreditIntro } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { LayoutService } from '../../../../website/services/layout.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import { CreditIntroCtaConfig } from '../../../models/credit/credit-intro-cta.interface';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';

@Component({
  selector: 'app-credit-intro',
  templateUrl: './credit-intro.component.html',
  styleUrls: ['./credit-intro.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, NgOptimizedImage, UiIconDirective, NgClass],
})
export class CreditIntroComponent implements OnInit {
  banner: ApiFile;

  @Input()
  data: CreditIntro;
  @Input() isEntekhab = false;

  @Input()
  firstCta: CreditIntroCtaConfig;

  @Input()
  secondCta: CreditIntroCtaConfig;

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.layout.screenSizeChanged.subscribe((screenSize) => {
      switch (screenSize) {
        case ScreenSize.isMobile:
          this.banner = this.data.mobileBanner;
          break;
        case ScreenSize.isTablet:
          this.banner = this.data.tabletBanner;
          break;
        default:
          this.banner = this.data.desktopBanner;
          break;
      }
    });
  }

  scrollToElement(element: string, scrollOption: ScrollLogicalPosition, link: string): void {
    if (link) return;
    const el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({ block: scrollOption, inline: scrollOption });
    }
  }
}
