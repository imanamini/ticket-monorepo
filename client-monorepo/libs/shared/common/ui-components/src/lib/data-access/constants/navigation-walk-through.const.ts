import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const NAVIGATION_WALK_THROUGH_CONFIG: WalkThroughConfig = {
  background: 'lighter',
  baseZIndex: 3000,
  rootElementId: 'walk-through-dpx',
  routeAfterEnd: '/',
  delay: 1000,
  startRoute: 'all',
  steps: signal([
    {
      id: 1,
      title: 'صفحه خدمات',
      selectorElement: {
        selector: 'bottom-navigation',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: false,
      position: 'top',
      description: 'این جا می‌توانید به تمام خدمات دیجی‌پی دسترسی داشته باشید.',
      isActive: signal(true),
      rightPointerPosition: 15,
      route: '/hub',
    },
    {
      id: 2,
      title: 'صفحه فروشگاه‌ها',
      selectorElement: {
        selector: 'bottom-navigation',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: false,
      position: 'top',
      description:
        'اینجا می‌توانید فروشگاه‌هایی که امکان خرید از طریق وام، اعتبار و کیف پول دیجی‌پی را برای شما فراهم می‌کنند، مشاهده کنید.',
      isActive: signal(false),
      pointerStickElement: '.bottom-navigation-items-item:nth-child(2)',
      route: '/stores',
    },
    {
      id: 3,
      title: 'صفحه پرداخت',
      selectorElement: {
        selector: 'bottom-navigation',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: false,
      position: 'top',
      description: 'تمام کارت‌های بانکی، اعتباری، کیف پول و تراکنش‌های خود را می‌توانید در صفحه کارت‌ها مشاهده کنید.',
      isActive: signal(false),
      pointerStickElement: '.bottom-navigation-items-item:nth-child(3)',
      route: '/transactions',
    },
    {
      id: 4,
      title: 'صفحه پروفایل',
      selectorElement: {
        selector: 'bottom-navigation',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: true,
      position: 'top',
      description: 'اینجا اطلاعات و تنظیمات حساب خود را می‌توانید مشاهده و مدیریت ‌کنید.',
      isActive: signal(false),
      pointerStickElement: '.bottom-navigation-items-item:nth-child(4)',
      route: '/profile',
    },
  ]),
};
