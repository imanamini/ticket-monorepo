import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const STORE_WALK_THROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 3000,
  rootElementId: 'stores-walk-through',
  delay: 2000,
  startRoute: '/stores',
  steps: signal([
    {
      id: 1,
      title: 'دارایی‌ها',
      selectorElement: {
        selector: 'assets',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: true,
      position: 'bottom',
      description: 'در این بخش، می‌توانید دسترسی سریع به موجودی کیف پول، کارت‌های اعتباری، وضعیت اشتراک و امتیاز پی‌کلاب خود داشته باشید.',
      isActive: signal(true),
      rightPointerPosition: 50,
    },
  ]),
};
