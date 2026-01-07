import { Component, Input, OnInit } from '@angular/core';
import { ApiFile } from '../../../api/clients/models/common/api-file';
import { LayoutService } from '../../../website/services/layout.service';
import { ScreenSize } from '../../../api/digipay/models/common/screen-size';
import { MerchantCreditIntro } from '../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-introduction-section',
  templateUrl: './ui-introduction-section.component.html',
  styleUrls: ['./ui-introduction-section.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent],
})
export class UiIntroductionSectionComponent implements OnInit {
  @Input()
  data: MerchantCreditIntro;

  @Input()
  scrollToFirstElementId: string;

  @Input()
  scrollToSecondElementId: string;

  banner: ApiFile;

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

  scrollToElement(element: string, scrollOption: ScrollLogicalPosition) {
    const el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({ block: scrollOption, inline: scrollOption });
    }
  }
}
