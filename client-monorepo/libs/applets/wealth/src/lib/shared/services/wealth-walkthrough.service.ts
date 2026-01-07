import { effect, Injectable, signal } from '@angular/core';
import { ProfileService } from '../../components/core/services/profile.service';
import { WEALTH_HOME_WALK_THROUGH_CONFIG } from '../../data-access/constants/home-walk-through';
import { WalkThroughService, WalkThroughStep } from '@client-monorepo/shared/common/walk-through';
import { EOnboarding, getCompletedOnboardings } from '../../data-access/constants/onboarding-map';

@Injectable({
  providedIn: 'root',
})
export class WealthWalkthroughService {
  allOnboardingSteps: WalkThroughStep[] = [
    {
      id: 1,
      title: 'دسته بندی‌ها',
      selectorElement: {
        selector: 'wealth-dashboard-categories',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: false,
      position: 'top',
      description: 'از این قسمت می‌توانید دسته‌بندی مورد نظر خود را برای سرمایه‌گذاری انتخاب کنید.',
      isActive: signal(true),
      maxHeight: '280px',
    },
    {
      id: 2,
      title: 'تراکنش‌ها',
      selectorElement: {
        selector: 'header-transactions',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: false,
      position: 'bottom',
      description: 'از این قسمت می‌توانید تراکنش‌ها و رسید‌های خرید، فروش، سود، تتمه و وضعیت‌ آن‌ها را مشاهده کنید.',
      isActive: signal(false),
      maxHeight: '170px',
      pointerStickElement: '#header-transactions:nth-child(2)',
      rightPointerPosition: 0,
    },
    {
      id: 4,
      title: 'پروفایل مدیریت ثروت',
      selectorElement: {
        selector: 'header-transactions',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: false,
      position: 'bottom',
      description: 'از این قسمت می‌توانید به اطلاعات خود و تنظیمات پروفایل مدیریت ثروت دسترسی داسته باشید.',
      isActive: signal(false),
      maxHeight: '170px',
      pointerStickElement: '#header-transactions:nth-child(3)',
    },
    {
      id: 8,
      title: 'بررسی حساب سجام',
      selectorElement: {
        selector: 'HOME_INFO_SEJAM_WRAPPER',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: false,
      position: 'top',
      description: 'از این قسمت می‌توانید سجامی بودن خود را بررسی کنید.',
      isActive: signal(false),
      scrollToAbsolutePosition: true,
      scrollContainer: {
        selector: 'main-layout-body',
        selectorType: 'class',
      },
    },
    {
      id: 16,
      title: 'سبد دارایی',
      selectorElement: {
        selector: 'wealth-assets',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: true,
      position: 'bottom',
      description: 'در این صفحه به جزییات دارایی و سفارشات در انتظار دسترسی دارید.',
      isActive: signal(false),
      pointerStickElement: '',
    },
  ];

  constructor(
    private profileService: ProfileService,
    public walkThroughService: WalkThroughService,
  ) {
    localStorage.removeItem('wealthHomeWalkThrough');
    this.handleEvents();
  }

  startWalkthrough(onboardedSections: string): void {
    const completedOnboardings = getCompletedOnboardings(onboardedSections);

    if (completedOnboardings.length === 0) {
      this.showWalkThrough();
    } else {
      const config = this.generateStepsBasedOnOnboarding(onboardedSections);
      this.walkThroughService.manageWalkThrough(config);
    }
  }

  private showWalkThrough(): void {
    WEALTH_HOME_WALK_THROUGH_CONFIG.steps.set(this.allOnboardingSteps);

    const walkThroughConfigs: any[] = [WEALTH_HOME_WALK_THROUGH_CONFIG];

    this.walkThroughService.manageWalkThrough(walkThroughConfigs);
  }

  private generateStepsBasedOnOnboarding(onboardedSections: string): any[] {
    const steps = [];
    const completedOnboardings = getCompletedOnboardings(onboardedSections);

    this.allOnboardingSteps.forEach((step) => {
      if (!completedOnboardings.includes(EOnboarding[step.id])) {
        steps.push(step);
      }
    });

    if (steps) {
      if (steps.length === 1) {
        steps[0].isFirst = true;
        steps[0].isLast = true;
        steps[0].isActive.set(true);
      } else if (steps.length > 1) {
        steps[0].isFirst = true;
        steps[0].isActive.set(true);
        steps[steps.length - 1].isLast = true;
      }
    }

    WEALTH_HOME_WALK_THROUGH_CONFIG.steps.set(steps);
    const walkThroughConfigs: any[] = [WEALTH_HOME_WALK_THROUGH_CONFIG];

    return walkThroughConfigs;
  }

  private handleEvents(): void {
    effect(() => {
      const event = this.walkThroughService.event();
      const activeStepIndex = WEALTH_HOME_WALK_THROUGH_CONFIG.steps().findIndex((step) => step.id === event.activeStepId);
      const onBoardedItem = EOnboarding[WEALTH_HOME_WALK_THROUGH_CONFIG.steps()[activeStepIndex - 1]?.id];
      let lastOnBoardedItem;
      if (event) {
        switch (event.name) {
          case 'next':
            this.profileService.onboard(onBoardedItem).subscribe();
            break;
          case 'done':
            if (WEALTH_HOME_WALK_THROUGH_CONFIG.steps().length === 1) {
              lastOnBoardedItem = EOnboarding[WEALTH_HOME_WALK_THROUGH_CONFIG.steps()[0].id];
            } else {
              const activeStepIndex = WEALTH_HOME_WALK_THROUGH_CONFIG.steps().findIndex((step) => step.id === event.activeStepId);
              if (activeStepIndex != -1) {
                lastOnBoardedItem = EOnboarding[WEALTH_HOME_WALK_THROUGH_CONFIG.steps()[activeStepIndex - 1]?.id];
              } else {
                lastOnBoardedItem =
                  EOnboarding[WEALTH_HOME_WALK_THROUGH_CONFIG.steps()[WEALTH_HOME_WALK_THROUGH_CONFIG.steps().length - 1]?.id];
              }
            }
            this.profileService.onboard(lastOnBoardedItem).subscribe();
            break;
        }
      }
    });
  }
}
