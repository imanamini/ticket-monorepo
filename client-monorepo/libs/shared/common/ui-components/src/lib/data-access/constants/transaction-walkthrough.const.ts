import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const TRANSACTION_WALKTHROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 2000,
  rootElementId: 'transaction-walk-through',
  delay: 3000,
  startRoute: '/transactions',
  steps: signal([
    {
      id: 1,
      title: 'پرداخت‌های بعدی',
      selectorElement: {
        selector: 'upcoming-transactions',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: false,
      position: 'top',
      description: 'اقساط یا قبوضی که زمان پرداخت آن رسیده را می‌توانید در اینجا پرداخت کنید.',
      isActive: signal(true),
    },
    {
      id: 2,
      title: 'پرداخت‌های سریع',
      selectorElement: {
        selector: 'frequent-transactions-summary',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: true,
      position: 'top',
      description: 'اینجا دسترسی سریع‌تر به تراکنش‌های دلخواهی که قبلا ستاره‌دار (ذخیره) کرده‌اید را دارید.',
      isActive: signal(false),
      scrollToAbsolutePosition: true,
      scrollContainer: {
        selector: 'page-layout-body',
        selectorType: 'class',
      },
      maxHeight: '170px',
    },
  ]),
};
