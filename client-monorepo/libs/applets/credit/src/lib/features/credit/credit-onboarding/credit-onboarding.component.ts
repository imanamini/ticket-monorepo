import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { OnboardingPage } from '../data-access/models/credit/volunteer/onboarding-page';
import { Router } from '@angular/router';
import { CreditUrlService } from '../data-access/utils/url';
import { MessageService } from '../data-access/services/message.service';
import { CreditNavigationService } from '../data-access/services/credit-navigation.service';
import { CreditExternalService } from '../data-access/services/credit-external.service';
import { Subscription } from 'rxjs';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { CreditDigipayImageComponent } from '../components/credit-digipay-image/credit-digipay-image.component';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-onboarding',
  templateUrl: './credit-onboarding.component.html',
  styleUrls: ['./credit-onboarding.component.scss'],
  standalone: true,
  imports: [
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    CreditDigipayImageComponent,
    NgxSkeletonLoadingComponent,
    NgxButtonComponent,
    PipesModule,
    CreditAppBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditOnboardingComponent implements OnInit, OnDestroy {
  pages = signal<OnboardingPage[]>([]);

  currentSlide = signal(0);

  actionSpinner = signal(false);

  externalGoBackSubscription!: Subscription;

  constructor(
    private creditApi: CreditApiService,
    private router: Router,
    private ms: MessageService,
    private creditNavigationService: CreditNavigationService,
    private creditExternalService: CreditExternalService,
    private creditUrlService: CreditUrlService,
  ) {}

  ngOnInit(): void {
    this.creditExternalService.creditTitle.next('وام‌ها');
    this.externalGoBackSubscription = this.creditExternalService.goBack.subscribe(() => {
      this.closeOnBoarding();
    });
    this.creditApi.getOnBoardingData().subscribe({
      next: (response) => {
        if (response.pages) {
          this.pages.set(response.pages.sort((a, b) => a.order - b.order));
        }
      },
      error: (e) => {
        this.ms.showErrorOfErrorResponse(e);
      },
    });
  }

  closeOnBoarding() {
    this.creditNavigationService.closeService();
  }

  onIndexChange(index: number) {
    setTimeout(() => {
      this.currentSlide.set(index);
    });
  }

  prevStep() {
    if (this.currentSlide() > 0) {
      this.currentSlide.set(this.currentSlide() - 1);
    }
  }

  nextStep() {
    if (this.currentSlide() < this.pages().length - 1) {
      this.currentSlide.set(this.currentSlide() + 1);
      return;
    }

    if (this.currentSlide() === this.pages().length - 1) {
      // final STEP ... .
      this.actionSpinner.set(true);
      this.creditApi.userFinishedOnboarding().subscribe({
        next: () => {
          this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/select-plan')).then();
        },
        error: (e) => {
          this.actionSpinner.set(false);
          this.ms.showErrorOfErrorResponse(e);
        },
      });
    }
  }

  slideToIndex(index: number) {
    this.currentSlide.set(index);
  }

  ngOnDestroy(): void {
    if (this.externalGoBackSubscription) {
      this.externalGoBackSubscription.unsubscribe();
    }
  }
}
