import {ChangeDetectionStrategy, Component, inject, Inject, input, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {LandingOnboardingSliderComponent} from "../landing-onboarding-slider/landing-onboarding-slider.component";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {heroSection} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [CommonModule, LandingOnboardingSliderComponent, NgxButtonComponent],
  templateUrl: './onboarding-header.component.html',
  styleUrl: './onboarding-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingHeaderComponent implements OnInit {

  isMobileMode = false;

  heroSection = input<heroSection>();
  urlService = inject(UrlService);

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileMode = window.innerWidth <= 1280;
    }

  }


  openLink(link: string): void {
    this.urlService.handleLink(link)
  }


}
