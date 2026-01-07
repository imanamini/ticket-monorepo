import { BnplHelpData } from './models/bnpl-help-data';
import { LANDING_ELEMENT_TYPE } from './models/landing-element';
import { BnplHelpSection } from './models/bnpl-help-section';

const getAssets = (relativeAddress: string): string => 'credit-assets/bnpl-help/' + relativeAddress;

const whereUseSection: BnplHelpSection = {
  menuTitle: 'قابل مصرف در',
  title: 'قابل مصرف در فروشگاه‌های آنلاین',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.STORES,
      payload: {},
    },
  ],
};

const individual1PayHowUseSection: BnplHelpSection = {
  menuTitle: 'روش استفاده',
  title: 'روش استفاده از اعتبار اقساطی',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ICON_CARD_STEPS,
      payload: {
        steps: [
          {
            title: 'مراجعه به فروشگاه',
            icon: getAssets('shopping_ecommerce_mobile_basket.svg'),
          },
          {
            title: 'تکمیل سبد خرید',
            icon: getAssets('shopping_ecommerce_basket_checkmark_button.svg'),
          },
          {
            title: 'انتخاب گزینه اعتبار اقساطی',
            icon: getAssets('payments_finance_credit_card_clock_time.svg'),
          },
        ],
      },
    },
  ],
};
export const individual4PayHowUseSection: BnplHelpSection = {
  menuTitle: 'روش استفاده',
  title: 'روش استفاده از اعتبار اقساطی',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ICON_CARD_STEPS,
      payload: {
        steps: [
          {
            title: 'مراجعه به فروشگاه',
            icon: getAssets('shopping_ecommerce_mobile_basket.svg'),
          },
          {
            title: 'تکمیل سبد خرید',
            icon: getAssets('shopping_ecommerce_basket_checkmark_button.svg'),
          },
          {
            title: 'انتخاب گزینه اعتبار اقساطی',
            icon: getAssets('payments_finance_credit_card_clock_time.svg'),
          },
        ],
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'به عنوان پیش پرداخت، <b>۲۵٪</b> مبلغ سبد خرید به صورت نقدی پرداخت می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'در صورت استفاده، معادل <b>4٪</b> اعتبار مصرف شده به عنوان هزینه خدمات و زیرساخت در اقساط محاسبه و دریافت می‌شود.',
      },
    },
  ],
};
const organizational1PayHowUseSection: BnplHelpSection = {
  menuTitle: 'روش استفاده',
  title: 'روش استفاده از اعتبار اقساطی',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ICON_CARD_STEPS,
      payload: {
        steps: [
          {
            title: 'مراجعه به فروشگاه',
            icon: getAssets('shopping_ecommerce_mobile_basket.svg'),
          },
          {
            title: 'تکمیل سبد خرید',
            icon: getAssets('shopping_ecommerce_basket_checkmark_button.svg'),
          },
          {
            title: 'انتخاب گزینه اعتبار اقساطی',
            icon: getAssets('payments_finance_credit_card_clock_time.svg'),
          },
        ],
      },
    },
  ],
};
export const organizational4PayHowUseSection: BnplHelpSection = {
  menuTitle: 'روش استفاده',
  title: 'روش استفاده از اعتبار اقساطی',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ICON_CARD_STEPS,
      payload: {
        steps: [
          {
            title: 'مراجعه به فروشگاه',
            icon: getAssets('shopping_ecommerce_mobile_basket.svg'),
          },
          {
            title: 'تکمیل سبد خرید',
            icon: getAssets('shopping_ecommerce_basket_checkmark_button.svg'),
          },
          {
            title: 'انتخاب گزینه اعتبار اقساطی',
            icon: getAssets('payments_finance_credit_card_clock_time.svg'),
          },
        ],
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'به عنوان پیش پرداخت، <b>۲۵٪</b> مبلغ سبد خرید به صورت نقدی پرداخت می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'در صورت استفاده، معادل <b>کارمزد توافق شده</b> به عنوان هزینه خدمات و زیرساخت در اقساط محاسبه و دریافت می‌شود.',
      },
    },
  ],
};

const individual1PayUsageDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت استفاده',
  title: 'مهلت استفاده از اعتبار اقساطی',
  subTitle: 'روی کارت اعتباری و در صفحه اصلی اعتبار اقساطی نمایش داده می‌شود.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'با پرداخت <b>به موقع</b> بدهی، اعتبار اقساطی شما برای استفاده مجدد <b>شارژ</b> می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description:
          'اگر تا پایان مهلت استفاده از اعتبارتان استفاده نکنید، برای استفاده دوباره به <b>اعتبارسنجی مجدد</b> نیاز خواهید داشت.',
      },
    },
  ],
};
const individual4PayUsageDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت استفاده',
  title: 'مهلت استفاده از اعتبار اقساطی',
  subTitle: 'روی کارت اعتباری و در صفحه اصلی اعتبار اقساطی نمایش داده می‌شود.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'با پرداخت <b>به موقع</b> بدهی، اعتبار اقساطی شما برای استفاده مجدد <b>شارژ</b> می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description:
          'اگر تا پایان مهلت استفاده از اعتبارتان استفاده نکنید، برای استفاده دوباره به <b>اعتبارسنجی مجدد</b> نیاز خواهید داشت.',
      },
    },
  ],
};
const organizational1PayUsageDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت استفاده',
  title: 'مهلت استفاده از اعتبار اقساطی',
  subTitle: 'روی کارت اعتباری و در صفحه اصلی اعتبار اقساطی نمایش داده می‌شود.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'با پرداخت <b>به موقع</b> بدهی، اعتبار اقساطی شما برای استفاده مجدد <b>شارژ</b> می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: '<b>جدید!</b> در صورت داشتن بدهی، باقی مانده اعتبار شما در ماه بعد قابل استفاده است.',
      },
    },
  ],
};
const organizational4PayUsageDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت استفاده',
  title: 'مهلت استفاده از اعتبار اقساطی',
  subTitle: 'روی کارت اعتباری و در صفحه اصلی اعتبار اقساطی نمایش داده می‌شود.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'با پرداخت <b>به موقع</b> بدهی، اعتبار اقساطی شما برای استفاده مجدد <b>شارژ</b> می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'در صورت داشتن بدهی، باقی مانده اعتبار شما در ماه بعد قابل استفاده است.',
      },
    },
  ],
};

const increaseCreditAmountSection: BnplHelpSection = {
  menuTitle: 'افزایش مبلغ اعتبار',
  title: 'افزایش مبلغ اعتبار',
  subTitle:
    'اگر از اعتبارتان <b>ماهانه و منظم</b> استفاده کنید و در پرداخت بدهی تاخیر نداشته باشید، مبلغ اعتبارتان به مرور <b>افزایش</b> پیدا می‌کند.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.IMAGE,
      payload: {
        image: getAssets('increase-credit-amount.svg'),
      },
    },
  ],
};

const individual1PayPaymentDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت پرداخت',
  title: 'مهلت پرداخت به موقع بدهی',
  subTitle: 'اول ماه بعد',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: '<b>پنج روز</b> فرصت پرداخت بدون جریمه دارید.',
      },
    },
  ],
};
const individual4PayPaymentDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت پرداخت',
  title: 'مهلت پرداخت به موقع بدهی',
  subTitle: 'اول هر ماه',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: '<b>پنج روز</b> فرصت پرداخت بدون جریمه دارید.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'اعتبار مصرف شده به صورت سه قسط ابتدای ماه‌های آتی سررسید می‌شود.',
      },
    },
  ],
};
const organizational1PayPaymentDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت پرداخت',
  title: 'مهلت پرداخت به موقع بدهی',
  subTitle: 'اول ماه بعد',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: '<b>پنج روز</b>  فرصت پرداخت بدون جریمه دارید.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description: 'درصورت عدم پرداخت به موقع بدهی، سازمان شما موظف به پرداخت بدهی همراه با <b>جریمه دیرکرد</b> از حقوق شما است.',
      },
    },
  ],
};
const organizational4PayPaymentDeadLineSection: BnplHelpSection = {
  menuTitle: 'مهلت پرداخت',
  title: 'مهلت پرداخت به موقع بدهی',
  subTitle: 'اول ماه بعد',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: '<b>پنج روز</b>  فرصت پرداخت بدون جریمه دارید.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'اعتبار مصرف شده به صورت سه قسط ابتدای ماه‌های آتی سررسید می‌شود.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description: 'درصورت عدم پرداخت به موقع بدهی، سازمان شما موظف به پرداخت بدهی همراه با <b>جریمه دیرکرد</b> از حقوق شما است.',
      },
    },
  ],
};

const penaltySection: BnplHelpSection = {
  menuTitle: 'جریمه دیرکرد',
  title: 'جریمه دیرکرد',
  subTitle: 'هر روز تاخیر <b> ۰.۲۵ </b> درصد به بدهی شما اضافه می‌شود.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description: 'علاوه بر آن با تاخیر بیشتر <b>رتبه اعتباری</b> شما برای دریافت دیگر سرویس‌های اعتباری، تضعیف می‌شود.',
      },
    },
  ],
};

const howPaySection: BnplHelpSection = {
  menuTitle: 'پرداخت بدهی',
  title: 'روش پرداخت بدهی',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.TEXT_CARD_STEPS,
      payload: {
        steps: [
          {
            description: 'اپلیکیشن، وب اپلیکیشن دیجی‌پی یا سرویس دیجی‌پی در صفحه اصلی دیجی‌کالا را باز کنید.',
          },
          {
            description: 'بخش خرید اعتباری را انتخاب کنید.',
          },
          {
            description: 'می‌توانید بدهی سررسید شده خود را مشاهده و پرداخت کنید.',
          },
        ],
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'برای یاداوری پرداخت پیامکی حاوی لینک مستقیم پرداخت با شماره <b> 021-53924000 </b> به شما ارسال می‌شود.',
      },
    },
  ],
};

const earlySettlementSection: BnplHelpSection = {
  menuTitle: 'پرداخت زودتر از موعد',
  title: 'پرداخت زودتر از موعد',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.TEXT_CARD,
      payload: {
        image: getAssets('payments_finance_credit_card_refresh.svg'),
        description:
          'اگر بدهی را زودتر از زمان مقرر پرداخت کنید، اعتبار شما مجددا <b>شارژ</b> می‌شود و می‌توانید تا پایان مهلت استفاده از آن استفاده کنید.',
      },
    },
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('info_small_icon.svg'),
        description: 'با پرداخت زودهنگام، تجربه پرداخت‌های یک کلیکی را تا پایان ماه چندین بار تکرار کنید.',
      },
    },
  ],
};
const earlySettlementSection4Pay: BnplHelpSection = {
  menuTitle: 'پرداخت زودتر از موعد',
  title: 'پرداخت زودتر از موعد',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.TEXT_CARD,
      payload: {
        image: getAssets('payments_finance_credit_card_refresh.svg'),
        description:
          'اگر بدهی را زودتر از زمان مقرر پرداخت کنید، اعتبار شما مجددا <b>شارژ</b> می‌شود و می‌توانید تا پایان مهلت استفاده از آن استفاده کنید.',
      },
    },
  ],
};

const returnSection: BnplHelpSection = {
  menuTitle: 'مرجوعی کالا',
  title: 'در صورت مرجوعی کالا',
  subTitle:
    'اعتبار مصرف شده، به اعتبار فعلی‌تان برمیگردد و در صورت مرجوعی بعد از تشکیل بدهی، اعتبار مصرف شده به <b>کیف پولتان</b> برمیگردد.',
  items: [],
};
const returnSection4Pay: BnplHelpSection = {
  menuTitle: 'مرجوعی کالا',
  title: 'در صورت مرجوعی کالا',
  subTitle:
    'اعتبار مصرف شده، به اعتبار فعلی‌تان برمیگردد و در صورت مرجوعی بعد از تشکیل بدهی، اعتبار مصرف شده به <b>کیف پولتان</b> برمیگردد.',
  items: [
    {
      type: LANDING_ELEMENT_TYPE.ALERT_BOX,
      payload: {
        icon: getAssets('warning_info.svg'),
        description: 'هزینه خدمات و زیرساخت برگردانده نمی‌شود.',
      },
    },
  ],
};

export const individual1PayBnplHelpData: BnplHelpData = {
  pageTitle: 'راهنمای اعتبار اقساطی دیجی‌پی',
  sections: [
    whereUseSection,
    individual1PayHowUseSection,
    individual1PayUsageDeadLineSection,
    individual1PayPaymentDeadLineSection,
    penaltySection,
    howPaySection,
    earlySettlementSection,
    returnSection,
  ],
};
export const individual4PayBnplHelpData: BnplHelpData = {
  pageTitle: 'راهنمای اعتبار اقساطی دیجی‌پی',
  sections: [
    whereUseSection,
    individual4PayHowUseSection,
    individual4PayUsageDeadLineSection,
    individual4PayPaymentDeadLineSection,
    penaltySection,
    howPaySection,
    earlySettlementSection4Pay,
    returnSection4Pay,
  ],
};
export const organizational1PayBnplHelpData: BnplHelpData = {
  pageTitle: 'راهنمای اعتبار (سازمانی)',
  sections: [
    whereUseSection,
    organizational1PayHowUseSection,
    organizational1PayUsageDeadLineSection,
    organizational1PayPaymentDeadLineSection,
    penaltySection,
    howPaySection,
    earlySettlementSection,
    returnSection,
  ],
};
export const organizational4PayBnplHelpData: BnplHelpData = {
  pageTitle: 'راهنمای اعتبار (سازمانی)',
  sections: [
    whereUseSection,
    organizational4PayHowUseSection,
    organizational4PayUsageDeadLineSection,
    organizational4PayPaymentDeadLineSection,
    penaltySection,
    howPaySection,
    earlySettlementSection4Pay,
    returnSection4Pay,
  ],
};
