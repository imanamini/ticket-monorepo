import { OnsiteShoppingGuideConfig } from '../models/onsite-shopping-guide.config';

export const ONSITE_SHOPPING_GUIDE: Record<string, OnsiteShoppingGuideConfig> = {
  qr: {
    icon: 'qr-scan',
    videoUrl: 'assets/stores/shopping-guide/qr-guide.mp4',
    imageUrl: 'assets/stores/shopping-guide/qr-code.png',
    calloutMessages: [
      'اسکن کیوآر کد موجود در فروشگاه یا دریافت کیوآرکد اختصاصی فاکتور از فروشنده',
      'وارد کردن  مبلغ نهایی در اپلیکیشن یا مشاهده فاکتور صادر شده',
      'تایید و پرداخت',
    ],
    calloutTitle: 'پرداخت با کیوآرکد',
    buttonLink: '/qr',
    buttonText: 'کیوآرکد خرید',
    buttonMarginTop: '32px',
  },
  barcode: {
    icon: 'barcode-scan',
    videoUrl: 'assets/stores/shopping-guide/barcode-guide.mp4',
    imageUrl: 'assets/stores/shopping-guide/barcode.png',
    calloutMessages: ['انتخاب اعتبار مورد نظر و «ساخت بارکد خرید»', 'نمایش بارکد یا اعلام کد ۸ رقمی به فروشنده', 'تایید و پرداخت'],
    calloutTitle: 'پرداخت با بارکد',
    buttonLink: '/barcode',
    buttonText: 'بارکد خرید',
    buttonMarginTop: '72px',
  },
  pos: {
    icon: 'bank-card-2',
    imageUrl: 'assets/stores/shopping-guide/connect-to-digipay.png',
    calloutMessages: [
      'اتصال کارت بانکی‌ مورد نظر به دیجی‌پی',
      'کشیدن کارت متصل شده در دستگاه کارت‌خوان فروشگاه طرف قرارداد',
      'پرداخت با اعتبار مورد نظر',
    ],
    calloutTitle: 'پرداخت با کارت‌خوان',
    buttonLink: '/profile/saved-cards',
    buttonText: 'اتصال به دیجی‌پی',
    buttonMarginTop: '52px',
  },
};
