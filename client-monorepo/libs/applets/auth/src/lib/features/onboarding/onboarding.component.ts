import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeColorOpacity, StorageService } from '@client-monorepo/common/utilities';
import { onboardingSlides } from '../../data-access/constants/onboarding-slides.constant';
import { Router } from '@angular/router';
import { HexColorModel, OnBoardingSlidesModel, RgbaColorModel } from '../../data-access/models/on-boarding-slides.model';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';

@Component({
  selector: 'auth-applet-onboarding',
  standalone: true,
  imports: [CommonModule, NgxDpCarouselSlideDirective, NgxDpCarouselComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent {
  storageService = inject(StorageService);
  router = inject(Router);
  slides = signal<OnBoardingSlidesModel[]>(onboardingSlides);
  activeIndex = signal(0);

  // intervalId: any;

  constructor() {
    if (this.storageService.isLoggedIn()) {
      this.goToHome();
    } else {
      if (this.storageService.isOnboardingChecked()) {
        this.goToLogin();
      }
    }
  }

  // ngOnInit(): void {
  // this.generateActiveIndexes();
  // }

  // generateActiveIndexes(): void {
  //   this.intervalId = setInterval(() => {
  //     if (this.activeIndex() >= this.slides().length - 1) {
  //       this.activeIndex.set(this.slides().length - 1);
  //       clearInterval(this.intervalId);
  //     } else {
  //       this.activeIndex.update((ex) => ex + 1);
  //     }
  //   }, 3000);
  // }

  handleCarouselNavBtnClick(direction: 'NEXT' | 'PREV') {
    // if (this.intervalId) {
    //   clearInterval(this.intervalId);
    // }
    if (direction === 'PREV') {
      if (this.activeIndex() <= 0) {
        return;
      }
      this.activeIndex.update((ex) => ex - 1);
    }
    if (direction === 'NEXT') {
      if (this.activeIndex() >= this.slides().length - 1) {
        this.goToNextStep();
      } else {
        this.activeIndex.update((ex) => ex + 1);
      }
    }
  }

  goToNextStep(): void {
    this.storageService.storeOnBoardingChecked();
    this.goToLogin();
  }

  goToLogin(): void {
    this.router.navigate(['auth/login']).then();
  }

  goToHome(): void {
    this.router.navigate(['/']).then();
  }

  getGradientBackGround(index: number): string {
    const selectedSlide = this.slides()[index];
    let startColor = '';
    let endColor = '';
    if (selectedSlide.backgroundGradient.firstColorHex) {
      startColor = this.generateHexColor(selectedSlide.backgroundGradient.firstColorHex);
    } else if (selectedSlide.backgroundGradient.firstColorRGBA) {
      startColor = this.generateRgbaColor(selectedSlide.backgroundGradient.firstColorRGBA);
    }
    if (selectedSlide.backgroundGradient.secondColorHex) {
      endColor = this.generateHexColor(selectedSlide.backgroundGradient.secondColorHex);
    } else if (selectedSlide.backgroundGradient.secondColorRGBA) {
      endColor = this.generateRgbaColor(selectedSlide.backgroundGradient.secondColorRGBA);
    }
    return `linear-gradient(${selectedSlide.backgroundGradient.degree}deg, ${startColor} 0%, ${endColor} 100%)`;
  }

  generateHexColor(color: HexColorModel): string {
    return ChangeColorOpacity.addOpacity(color.color, color.alpha) + ' ' + color.position + '%';
  }

  generateRgbaColor(color: RgbaColorModel): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}) ${color.position}%`;
  }
}
