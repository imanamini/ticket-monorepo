import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject, input,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { interval, Subscription} from "rxjs";
import {ApiFile} from "../../../../../api/clients/models/common/api-file";

@Component({
  selector: 'app-landing-onboarding-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-onboarding-slider.component.html',
  styleUrl: './landing-onboarding-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingOnboardingSliderComponent implements OnInit{

  images = input<Array<{
    image: ApiFile
  }>>();

  currentIndex = 0;
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  startAutoSlide() {
    this.subscription = interval(2000).subscribe(() => this.nextSlide());
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images().length;
    this.cdr.markForCheck();
  }

}
