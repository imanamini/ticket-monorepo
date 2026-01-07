import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';
import { signal } from '@angular/core';

export const HUB_WALKTHROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 2000,
  rootElementId: 'hub-walk-through',
  delay: 2500,
  startRoute: '/hub',
  steps: signal([
    {
      id: 1,
      title: 'موجودی کل',
      selectorElement: {
        selector: 'hub-assets',
        selectorType: 'id',
      },
      isFirst: true,
      isLast: false,
      position: 'bottom',
      description:
        'اینجا می‌توانید موجودی قابل خرج‌کرد خود که شامل موجودی کیف‌پول، اعتبارها و وام خود را مشاهده کنید. با کلیک بر روی جزییات',
      isActive: signal(true),
    },
    {
      id: 2,
      title: 'موجودی کل',
      selectorElement: {
        selector: 'hub-assets',
        selectorType: 'id',
      },
      isFirst: false,
      isLast: false,
      position: 'bottom',
      description: 'با کلیک بر روی جزییات، می‌توانید موجودی هر کدام از دارایی های خود را به تفکیک مشاهده کنید.',
      isActive: signal(false),
    },
    {
      id: 3,
      title: 'خدمات دیجی‌پی',
      selectorElement: {
        selector: 'hub-services',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: false,
      position: 'bottom',
      description: 'در این بخش، تمامی خدمات دیجی‌پی در دو بخش خدمات ویژه و خدمات مالی در دسترس می‌باشد.',
      isActive: signal(false),
    },
    {
      id: 4,
      title: 'خدمات دیجی‌پی',
      selectorElement: {
        selector: 'hub-services',
        selectorType: 'class',
      },
      isFirst: false,
      isLast: true,
      position: 'bottom',
      description: 'با کلیک برروی همه‌ی خدمات، لیست جامع و کامل خدمات دیجی‌پی با قابلیت جست‌و‌جو و فیلتر در اختیار شما خواهد بود.',
      isActive: signal(false),
    },
  ]),
};
