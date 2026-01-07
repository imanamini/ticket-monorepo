import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject, input,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {DeviceDetectorService} from "../../../../../../../core/services/device/deviceDetector.service";
import {interval, Subscription} from "rxjs";
import {ScrollToAnchorDirective} from "../../../../../../../ui/ui-directive/scroll-to-anchor.directive";
import {intro} from "../../../../../../../api/clients/models/templates/c-bnpl-v2/CBnplV2Template";
import {UrlService} from "../../../../../../services/url.service";

@Component({
  selector: 'app-bnpl-intro',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, ScrollToAnchorDirective],
  templateUrl: './bnpl-intro.component.html',
  styleUrl: './bnpl-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplIntroComponent implements OnInit {

  currentIndex = 0;
  protected deviceDetector = inject(DeviceDetectorService);
  private urlService = inject(UrlService);

  introSection = input<intro>()

  private subscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    this.subscription = interval(2000).subscribe(() => this.nextSlide());
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.introSection().sectionSlider.mobileSlider.length;
    this.cdr.markForCheck();
  }

  openLink(link: string) {
    this.urlService.handleLink(link)
  }
}
