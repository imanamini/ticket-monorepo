import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { UsedOnboardingPageModel } from './models/used-onboarding-page.model';
import { SharedUsedService } from '../../services/shared-used.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'used-journey-onboarding',
  templateUrl: './used-onboarding.component.html',
  standalone: true,
  imports: [CarouselModule, PipesModule, NgClass, NgIf, NgForOf, UiButtonComponent],
  styleUrls: ['./used-onboarding.component.scss'],
})
export class UsedOnboardingComponent implements OnInit, OnDestroy {
  @ViewChild('owlCarousel')
  owlCarousel: CarouselComponent;

  @Output()
  finished = new EventEmitter<boolean>();

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    nav: false,
    rtl: true,
    navSpeed: 500,
    responsive: {
      0: {
        items: 1,
      },
    },
  };
  pages: UsedOnboardingPageModel[] = [
    {
      imageSrc: 'insurance-assets/images/used-device/used-intro-image.svg',
      title: 'دریافت بیمه در لحظه',
      content: ' تنها با انتخاب برند و مدل گوشی، ارزش تقریبی آن را دریافت و در لحظه بیمه تجهیزات بگیرید.',
      order: 1,
    },
    {
      imageSrc: 'insurance-assets/images/used-device/used-repair-image.svg',
      title: 'تعمیر و تعویض رایگان قطعات',
      content: 'بدون پرداخت هزینه فرانشیز قطعات گوشی شما تعمیر و تعویض شده و در اختیارتان قرار می گیرد.',
      order: 2,
    },
    {
      imageSrc: 'insurance-assets/images/used-device/used-damage-image.svg',
      title: 'پرداخت خسارت ۴۸ ساعته',
      content: 'در صورت طولانی شدن پرداخت خسارت و تا زمان‌ آماده سازی، دستگاه جایگزین در اختیار شما قرار می‌گیرد.',
      order: 3,
    },
  ];
  currentSlide = 0;
  externalGoBackSubscription: Subscription;

  constructor(private sharedService: SharedUsedService) {}

  ngOnInit(): void {
    this.sendIntrackEvent();
  }

  sendIntrackEvent(): void {
    this.sharedService.sendIntrackEvent('I_OPW');
  }

  closeOnBoarding(): void {
    localStorage.setItem(this.sharedService.usedOnBoardingKey, 'true');
    this.finished.emit(true);
  }

  changed($event): void {
    this.currentSlide = $event.startPosition;
  }

  prevStep(): void {
    if (this.currentSlide > 0) {
      this.currentSlide -= 1;
      this.owlCarousel.prev();
    }
  }

  nextStep(): void {
    if (this.currentSlide < this.pages.length - 1) {
      this.currentSlide += 1;
      this.owlCarousel.next();
      return;
    }

    if (this.currentSlide === this.pages.length - 1) {
      // final STEP
      this.closeOnBoarding();
    }
  }

  slideToIndex(index): void {
    this.owlCarousel.to('slide-' + index);
    this.currentSlide = index;
  }

  ngOnDestroy(): void {
    if (this.externalGoBackSubscription) {
      this.externalGoBackSubscription.unsubscribe();
    }
  }
}
