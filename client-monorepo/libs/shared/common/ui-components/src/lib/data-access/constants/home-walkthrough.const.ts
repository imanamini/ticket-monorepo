import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const HOME_WALKTHROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 2000,
  rootElementId: 'home-walk-through',
  delay: 3000,
  startRoute: '/home',
  steps: signal([
    {
      id: 1,
      title: 'پشنهاد دیجی‌پی',
      selectorElement: {
        selector: 'main-action-walkthrough',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: false,
      position: 'bottom',
      description: 'در این قسمت مهمترین‌ فعالیت‌ها به شما پیشنهاد داده می‌شود.',
      isActive: signal(true),
    },
    {
      id: 2,
      title: 'دیگر فعالیت‌های پیشنهادی',
      selectorElement: {
        selector: 'other-walkthrough',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: true,
      position: 'top',
      description: 'اینجا می‌توانید تعدادی دیگر از فعالیت‌های خود را مشاهده و پیگیری کنید.',
      isActive: signal(false),
      scrollToAbsolutePosition: false,
      maxHeight: '220px',
    },
  ]),
};
