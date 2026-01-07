import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { PlanServiceConfigModel } from './models/plan-service-config.model';
import { formatPriceToString } from '@client-monorepo/common/utilities';
import { generateCashbackDescription } from './generate-cashback-description';
import { concatStoreNames } from './ui-plan-services/concat-store-names';
import { generateManagementDescription } from './generate-management-description';
import { generatePayDescription } from './generatePayDescription';
import { concatPayMethod } from './concatPayMethod';

export function generateServiceConfig(service: PlanServices): PlanServiceConfigModel {
  let configService!: PlanServiceConfigModel;
  switch (service.type) {
    case SERVICES_TYPE.CREDIT:
      configService = {
        ...service,
        title: 'وام خرید کالا',
        icon: 'assets/subscription/icons/services/credit-fill.svg',
        hasDetail: true,
        description: {
          text: `امکان دریافت وام تا سقف ${formatPriceToString(+service.amount)} با توجه به نتیجه اعتبارسنجی‌ بانکی`,
          keywords: [formatPriceToString(+service.amount)],
        },
        detail: {
          title: 'وام خرید کالا',
          subtitle: 'نکاتی در رابطه با وام دیجی‌پی و شرایط دریافت آن',
          icon: 'assets/subscription/icons/services/credit.svg',
          contents: [
            {
              points: [
                'دریافت وام وابسته به نتیجه اعتبارسنجی بانکی شما و داشتن شرایط موردنیاز تامین‌ کننده مالی است.',
                'سود اقساط این وام ۲۳ درصد می‌باشد که معادل نرخ مصوب بانک مرکزی است.',
                'ضمانت موردنیاز برای دریافت وام، چک صیادی و یا سفته است.',
                'قابل استفاده در دیجی‌کالا و ده‌ها فروشگاه آنلاین و حضوری دیگر.',
              ],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_BNPL_4PAY:
    case SERVICES_TYPE.BNPL_4PAY:
      configService = {
        ...service,
        title: 'اعتبار ۴ قسطه',
        icon: 'assets/subscription/icons/services/bnpl-fill.svg',
        hasDetail: true,
        description: {
          text: `${service.amount ? `افزایش اعتبار  ویژه‌ی خرید در فروشگاه‌ها متناسب با رتبه‌ی اعتباری مشتری تا سقف ${formatPriceToString(+service.amount)}` : 'افزایش اعتبار  ویژه‌ی خرید در فروشگاه‌ها متناسب با رتبه‌ی اعتباری مشتری'}`,
          keywords: [''],
        },
        detail: {
          title: 'اعتبار ۴ قسطه',
          subtitle: 'نکاتی در رابطه با اعتبار ۴ قسطه دیجی‌پی',
          icon: 'assets/subscription/icons/services/bnpl.svg',
          contents: [
            {
              points: [
                'بعد از خرید اشتراک، اعتبار خدمات مالی روزانه دیجی‌پی برای شما فعال می‌شود.',
                'اعتبار دریافت شده در چهار قسط قابل پرداخت خواهد بود.',
                'با پرداخت به موقع بدهی، اعتبار شما برای استفاده دوباره شارژ می‌شود.',
                'از یکم تا پنجم هر ماه مهلت دارید تا بدون جریمه بدهی خود را پرداخت کنید.',
              ],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_BNPL_1PAY:
    case SERVICES_TYPE.BNPL_1PAY:
      configService = {
        ...service,
        title: 'الان بخر، بعدا پرداخت کن',
        icon: 'assets/subscription/icons/services/bnpl-fill.svg',
        hasDetail: true,
        description: {
          text: `دریافت ${formatPriceToString(+service.amount)} اعتبار ویژه‌ی خدمات مالی روزانه، اول هر ماه`,
          keywords: [formatPriceToString(+service.amount)],
        },
        detail: {
          title: 'الان بخر، بعدا پرداخت کن!',
          subtitle: 'نکاتی در رابطه با اعتبار تک قسطه دیجی‌پی',
          icon: 'assets/subscription/icons/services/bnpl.svg',
          contents: [
            {
              points: [
                'بعد از خرید اشتراک، اعتبار خدمات مالی روزانه دیجی‌پی برای شما فعال می‌شود.',
                'با پرداخت به موقع بدهی، اعتبار شما برای استفاده دوباره شارژ می‌شود.',
                'از یکم تا پنجم هر ماه مهلت دارید تا بدون جریمه بدهی خود را پرداخت کنید.',
              ],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.COIN:
      configService = {
        ...service,
        title: 'سکه‌ی پی‌کلاب',
        icon: 'assets/subscription/icons/services/coin-fill.svg',
        hasDetail: false,
        description: {
          text: `دریافت آنی ${service.amount} سکه پی‌کلاب برای شرکت در قرعه‌کشی‌ها و دریافت هدایای پی‌کلاب`,
          keywords: [`${service.amount} سکه`],
        },
      };
      break;
    case SERVICES_TYPE.H_AFFORDABLE_INSURANCE:
      configService = {
        ...service,
        title: 'بیمه به‌صرفه‌',
        icon: 'assets/subscription/icons/services/insurance-fill.svg',
        hasDetail: true,
        description: {
          text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با پوشش حداکثری خسارت ناشی از هر نوع سرقت.',
          keywords: ['هر نوع سرقت.'],
        },
        detail: {
          title: 'بیمه تجهیزات الکترونیک',
          secondSubtitle: 'خسارت‌های زیر:',
          subtitle: 'بیمهٔ یکساله با تعهد پوشش تا سقف ۳۰ میلیون تومان',
          icon: 'assets/subscription/icons/services/insurance.svg',
          contents: [
            {
              points: ['هر نوع سرقت، دستبرد و حوادث مرتبط با آن'],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_COMPREHENSIVE_INSURANCE:
      configService = {
        ...service,
        title: 'بیمه جامع',
        icon: 'assets/subscription/icons/services/insurance-fill.svg',
        hasDetail: true,
        description: {
          text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با پوشش حداکثری خسارت ناشی از هر نوع سرقت یا از دست رفتن کامل دستگاه بر اثر هر نوع حادثه.',
          keywords: ['هر نوع سرقت', 'از دست رفتن کامل دستگاه بر اثر هر نوع حادثه.'],
        },
        detail: {
          title: 'بیمه تجهیزات الکترونیک',
          secondSubtitle: 'خسارت‌های زیر:',
          subtitle: 'بیمهٔ یکساله با تعهد پوشش تا سقف ۳۰ میلیون تومان',
          icon: 'assets/subscription/icons/services/insurance.svg',
          contents: [
            {
              points: ['هر نوع سرقت، دستبرد و حوادث مرتبط با آن', 'از دست رفتن کامل دستگاه بر اثر هر نوع حادثه'],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_FULL_INSURANCE:
      configService = {
        ...service,
        title: 'بیمه‌ی سرقت و خرابی موبایل',
        icon: 'assets/subscription/icons/services/insurance-fill.svg',
        hasDetail: true,
        description: {
          text: `امکان خرید بیمهٔ یکسالهٔ موبایل با سقف ارزشی  ${formatPriceToString(+service.amount)} و پوشش حداکثری خسارات ناشی از هر نوع سرقت و حوادث منجر به آسیب فیزیکی به دستگاه.`,
          keywords: ['حوادث منجر به آسیب فیزیکی', 'هر نوع سرقت', 'پوشش حداکثری', `${formatPriceToString(+service.amount)}`],
        },
        detail: {
          title: 'بیمه‌ی سرقت و خرابی موبایل',
          secondSubtitle: `بیمهٔ یکساله موبایل تا سقف ارزشی ${formatPriceToString(+service.amount)}`,
          subtitle: '',
          icon: 'assets/subscription/icons/services/insurance.svg',
          contents: [
            {
              title: 'تعهد پوشش ۸۰ درصدی خسارت‌های زیر:',
              firstPoint: '',
              points: [
                'سرقت ، دستبرد و حوادث مرتبط با آنها (به هر دلیل)',
                'ضربه‌ خوردن و ضرب‌دیدگی دستگاه و شکستگی کلی و جزئی',
                'هر نوع آبدیدگی، نم‌زدگی، زنگ‌زدگی و رسوب‌زدگی که منجر به از کارافتادگی دستگاه بیمه شود',
                'سوختگی، نیم‌سوز شدن، دودزدگی و خسارت ناشی از استعمال دخانیات، آتش‌سوزی، صاعقه یا انفجار',
                'القا الکتریکی، اتصال کوتاه و نوسان ولتاژ برق',
                'به کارگیری اشتباه تجهیزات، سهل‌انگاری و اعمال کینه‌جویانه کارکنان یا اشخاص ثالث',
                'حوادث طبیعی مانند طوفان، سیل و .. به استثناء زمین لرزه',
              ],
            },
          ],
          info: {
            title: 'نحوه‌ی دریافت بیمه‌نامه:',
            infoMessage:
              'بیمه‌نامه پس از خرید اشتراک برای شما صادر می‌شود. کافیست از طریق لینک ارسال شده در پیامک نسبت به فعالسازی آن اقدام کنید.',
          },
        },
      };
      break;
    case SERVICES_TYPE.H_BEYOND_INSURANCE:
      configService = {
        ...service,
        title: 'فراتر از بیمه',
        icon: 'assets/subscription/icons/services/insurance-fill.svg',
        hasDetail: true,
        description: {
          text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با تعهد تعمیر یا تعویض دستگاه در صورت بروز هر نوع حادثه با پوشش کامل هر‌گونه هزینه.',
          keywords: ['تعهد تعمیر یا تعویض دستگاه', 'با پوشش کامل هر‌گونه هزینه.'],
        },
        detail: {
          title: 'بیمه تجهیزات الکترونیک',
          secondSubtitle: 'بیمهٔ یکساله با مزیتی بی‌نظیر:',
          subtitle: 'فراتر از بیمه‌!',
          icon: 'assets/subscription/icons/services/insurance.svg',
          contents: [
            {
              title: 'تعهد پوشش تا سقف ۳۰ میلیون تومان در خسارت‌های زیر:',
              firstPoint:
                'تعهد تعمیر رایگان دستگاه در صورت بروز هر نوع حادثه بدون پرداخت سهم بیمه‌گزار (فرانشیز صفر) تا سقف ۳۰ میلیون تومان',
              points: [
                'ضربه‌ خوردن و ضرب‌دیدگی دستگاه و شکستگی کلی و جزئی',
                'هر نوع آبدیدگی، نم‌زدگی، زنگ‌زدگی و رسوب‌زدگی که منجر به از کارافتادگی دستگاه بیمه شود',
                'سوختگی، نیم‌سوز شدن، دودزدگی و خسارت ناشی از استعمال دخانیات',
                'القا الکتریکی، اتصال کوتاه و نوسان ولتاژ برق',
                'سرقت ، دستبرد و حوادث مرتبط با آنها (به هر دلیل)',
                'به کارگیری اشتباه تجهیزات، سهل‌انگاری و اعمال کینه‌جویانه کارکنان یا اشخاص ثالث',
                'حوادث طبیعی مانند طوفان و ..',
                'از دست رفتن کامل دستگاه به دلیل هر گونه حادثه',
              ],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_DELIVERY_GUARANTY:
      configService = {
        ...service,
        title: 'تضمین تحویل کالا',
        icon: 'assets/subscription/icons/services/delivery-guarranty-fill.svg',
        hasDetail: false,
        description: {
          text: `برای تمام فروشگاه‌های تحت پوشش دیجی‌پی`,
          keywords: [''],
        },
      };
      break;
    case SERVICES_TYPE.H_DOCUMENT_FREE_SHIPPING:
      configService = {
        ...service,
        title: 'ارسال رایگان مدارک',
        icon: 'assets/subscription/icons/services/logistics-fill.svg',
        hasDetail: false,
        description: {
          text: 'ارسال و دریافت رایگان همه‌ی مدارک برای مشتریان وام',
          keywords: ['مشتریان وام'],
        },
      };
      break;
    case SERVICES_TYPE.DPCARD_ISUUANCE:
      configService = {
        ...service,
        title: 'کارت فیزیکی دیجی‌پی',
        icon: 'assets/subscription/icons/services/dp-card-fill.svg',
        hasDetail: false,
        description: {
          text: `دریافت دیجی‌کارت با امکان خرید از تمام فروشگاه‌های حضوری در سطح کشور به همراه برگشت ‌پول`,
          keywords: [''],
        },
      };
      break;
    case SERVICES_TYPE.CASHBACK:
      configService = {
        ...service,
        title: 'برگشت ‌پول با خرید شارژ و بسته اینترنت',
        icon: 'assets/subscription/icons/services/cashback-fill.svg',
        hasDetail: false,
        description: {
          text: `امکان برگشت پول  ۱۰٪ تا سقف ۳۰۰ هزار تومان به کیف پول`,
          keywords: [`برگشت پول  ۱۰٪`],
        },
      };
      break;
    case SERVICES_TYPE.PURCHASE_CASHBACK:
      configService = {
        ...service,
        title: 'برگشت پول با خرید از کیف پول با دیجی‌کارت',
        icon: 'assets/subscription/icons/services/store-fill.svg',
        hasDetail: false,
        description: {
          text: ` بهره‌مندی از برگشت پول ${service.cashbackPercentage ?? 10}٪ تا سقف ${formatPriceToString(+service.maxCashbackPerPlan ? +service.maxCashbackPerPlan : 10000)} به کیف پول با هر خرید از فروشگاه‌های دیجی‌پی`,
          keywords: [` برگشت پول ${service.cashbackPercentage ?? 10}٪`],
        },
      };
      break;
    case SERVICES_TYPE.H_DISCOUNT_INSURANCE:
      configService = {
        ...service,
        title: 'تخفیف بیمه',
        icon: 'assets/subscription/icons/services/insurance-fill.svg',
        hasDetail: false,
        description: {
          text: 'تخفیف در خرید بیمه‌ در سایر حوزه‌ها',
          keywords: [''],
        },
      };
      break;
    case SERVICES_TYPE.H_WEALTH:
      configService = {
        ...service,
        title: 'مشاوره سرمایه‌گذاری',
        icon: 'assets/subscription/icons/services/wealth-fill.svg',
        hasDetail: true,
        description: {
          text: `${service.amount} ماه مشاوره و مدیریت پرتفوی سرمایه‌گذاری`,
          keywords: [`${service.amount} ماه`],
        },
        detail: {
          title: 'مشاوره سرمایه‌گذاری',
          subtitle: `${service.amount} ماه مشاوره و مدیریت پرتفوی سرمایه‌گذاری`,
          icon: 'assets/subscription/icons/services/wealth.svg',
          contents: [
            {
              points: ['معرفی سبد سفارشی‌سازی شده ', 'سرمایه‌گذاری متناسب با درخواست کاربر', 'آموزش سواد مالی'],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.H_SUPPORT:
      configService = {
        ...service,
        title: 'پشتیبانی ویژه',
        icon: 'assets/subscription/icons/services/support-fill.svg',
        hasDetail: false,
        description: {
          text: 'پشتیبانی اختصاصی و ویژه ۲۴ ساعته در تمام هفته',
          keywords: [''],
        },
      };
      break;
    case SERVICES_TYPE.H_DISCOUNT_STORES:
      configService = {
        ...service,
        title: 'تخفیف‌های ویژه‌ی فروشگاه‌ها',
        icon: 'assets/subscription/icons/services/store-fill.svg',
        hasDetail: true,
        description: {
          text: 'ارائه تخفیف‌ها و پیشنهادات ویژه در فروشگاه‌های منتخب',
          keywords: [`یک ماه`],
        },
        detail: {
          title: 'تخفیف‌های ویژه‌ی فروشگاه‌ها',
          subtitle: 'تخفیف‌ها و پیشنهادات ویژه شامل:',
          icon: 'assets/subscription/icons/services/store.svg',
          contents: [
            {
              points: [
                'تخفیف‌های ویژه برای خرید از فروشگاه‌های منتخب تا سقف ۵۰ درصد تخفیف',
                'برگشت بخشی از مبلغ خرید به کیف پول کاربر برای خرید از فروشگاه‌های منتخب',
              ],
            },
          ],
        },
      };
      break;
    case SERVICES_TYPE.MERCHANT_CASHBACK:
      configService = {
        ...service,
        title: service?.merchantCashbackList?.[0]?.businessTitle ?? '',
        icon: service?.merchantCashbackList?.[0]?.businessId ?? '',
        hasDetail: false,
        managementDescription: {
          text: `${generateManagementDescription(service?.merchantCashbackList ?? [])}`,
          keywords: [''],
        },
        managementDescriptionDetail: {
          text: `${generatePayDescription(service?.merchantCashbackList?.[0].paymentGateway ?? [])}`,
          keywords: [''],
        },
        description: generateCashbackDescription(
          service?.merchantCashbackList?.[0].paymentGateway ?? [],
          service?.merchantCashbackList?.[0].businessTitle ?? '',
        ),
      };
      break;
    case SERVICES_TYPE.F_H_DPCARD_ISUUANCE:
      configService = {
        type: SERVICES_TYPE.F_H_DPCARD_ISUUANCE,
        title: 'کارت فیزیکی دیجی‌پی',
        icon: 'assets/subscription/icons/services/dp-card-fill.svg',
        hasDetail: false,
        description: {
          text: 'دریافت دیجی‌کارت با امکان خرید از تمام فروشگاه‌های حضوری در سطح کشور به همراه برگشت ‌پول',
          keywords: [''],
        },
        badge: {
          mode: 'bold',
          status: 'info',
          content: 'به زودی',
        },
        isComing: true,
      } as PlanServiceConfigModel;
      break;
    case SERVICES_TYPE.F_H_PURCHASE_CASHBACK:
      configService = {
        type: SERVICES_TYPE.F_H_PURCHASE_CASHBACK,
        title: 'برگشت‌ پول با خرید از کیف پول یا دیجی‌کارت',
        icon: 'assets/subscription/icons/services/store-fill.svg',
        hasDetail: false,
        description: {
          text: 'برگشت ۱۰٪ تا سقف ۲ میلیون تومان به کیف پول با هر خرید از فروشگاه‌های دیجی‌پی',
          keywords: [''],
        },
        badge: {
          mode: 'bold',
          status: 'info',
          content: 'به زودی',
        },
        isComing: true,
      } as PlanServiceConfigModel;
      break;
  }
  if (SERVICES_TYPE.MERCHANT_CASHBACK && service?.merchantCashbackList && service?.merchantCashbackList.length > 1) {
    const concatValue: string = concatStoreNames(service?.merchantCashbackList);
    configService = {
      ...service,
      title: 'فروشگاه‌های منتخب',
      icon: 'assets/subscription/icons/services/store-fill.svg',
      hasDetail: true,
      description: concatPayMethod(service?.merchantCashbackList ?? []),
      managementDescription: {
        text: `برگشت ‌پول در ${concatValue}`,
        keywords: [concatValue],
      },
      detail: {
        title: 'برگشت ‌پول',
        subtitle: 'در فروشگاه‌های منتخب دیجی پی',
        icon: 'assets/subscription/icons/services/store-fill.svg',
        contents: [
          {
            points: [
              `برگشت ‌پول در ${concatValue}`,
              'این برگشت ‌پول پس از خرید از فروشگاه‌های نام‌برده به کیف پول دیجی‌پی شما واریز خواهد شد.',
            ],
          },
        ],
      },
    };
  }
  return configService;
}
