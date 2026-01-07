import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgStyle } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import {
  SmartScoringOnboardingModel,
  smartScoringOnboardingSlidesConstant,
} from '../../../data-access/models/credit-smart-scoring/smart-scoring-onboarding-slides.interface';
import player from 'lottie-web/build/player/lottie_light';
import { smartScoringOnboardingSlidesAnimation } from '../../../data-access/models/credit-smart-scoring/smart-scoring-onboarding-slides-animation';

@Component({
  selector: 'app-credit-smart-score-onboarding-sheet',
  templateUrl: './credit-smart-score-onboarding-sheet.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-score-onboarding-sheet.component.scss'],
  imports: [LottieComponent, NgxDpCarouselComponent, NgxDpCarouselSlideDirective, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class CreditSmartScoreOnboardingSheetComponent {
  private ngxBottomSheetService = inject(NgxBottomSheetService);
  slides = signal<SmartScoringOnboardingModel[]>(smartScoringOnboardingSlidesConstant);
  activeIndex = signal(0);
  onboardingAnimation = computed(() => {
    const index = this.activeIndex();
    return smartScoringOnboardingSlidesAnimation[index];
  });

  onIndexChange(index: number): void {
    setTimeout(() => {
      this.activeIndex.set(index);
    });
  }

  onButtonClicked(direction: 'NEXT' | 'PREV'): void {
    const currentIndex = this.activeIndex();

    if (currentIndex === 2 && direction === 'NEXT') {
      this.closeBottomSheet();
    }
  }

  closeBottomSheet() {
    this.ngxBottomSheetService.closeBottomSheet();
  }
}
