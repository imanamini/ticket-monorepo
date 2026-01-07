import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const PROFILE_WALKTHROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 2000,
  rootElementId: 'profile-walk-through',
  delay: 2000,
  startRoute: '/profile',
  steps: signal([
    {
      id: 1,
      title: 'اشتراک دیجی‌پی',
      selectorElement: {
        selector: 'profile-subscription',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: false,
      position: 'bottom',
      description: 'اینجا، سطح اشتراک خود را مشاهده می‌کنید و با ارتقای سطح می‌توانید از خدمات و مزایای ویژه‌ای بهره‌مند شوید.',
      isActive: signal(true),
      rightPointerPosition: 50,
    },
    {
      id: 2,
      title: 'پی‌کلاب',
      selectorElement: {
        selector: 'profile-pay-club',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: true,
      position: 'bottom',
      description: 'اینجا، به پی‌کلاب دسترسی دارید و باتوجه به امتیاز‌های خود می‌توانید از تخفیف‌های داغ و جوایز مختلف استفاده کنید.',
      isActive: signal(false),
      pointerStickElement: '.profile-cards-item:nth-child(2)',
    },
  ]),
};
