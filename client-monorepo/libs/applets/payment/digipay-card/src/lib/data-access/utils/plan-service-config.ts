import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { formatPriceToString } from '@client-monorepo/common/utilities';
import { generateManagementDescription } from './generate-management-description';
import { concatPayMethod } from './concatPayMethod';
import { PlanServiceConfigModel, PlanServiceDescription, PlanServiceConfigDetail } from '../models/plan-service-config.model';
import { generateCashbackDescription } from './generate-cashback-description';
import { concatStoreNames } from './concat-store-names';
import { generatePayDescription } from './generatePayDescription';

// ---------- DEFAULT (must include all required fields of PlanServiceConfigModel) ----------
const DEFAULT_PLAN_SERVICE_CONFIG: PlanServiceConfigModel = {
  // fields from PlanServices (set reasonable defaults)
  type: SERVICES_TYPE.COIN,
  active: false,
  price: 0,
  amount: 0,
  fee: 0,
  order: 0,
  allocatedAmount: undefined,
  errorContent: undefined,
  nextAction: undefined,
  level: undefined,
  status: undefined as unknown as any, // replace if you have a default SERVICE_STATUS
  hasGift: false,
  templateId: undefined,
  title: '', // note: overwritten by specific handlers
  merchantCashbackList: [],
  tags: [],

  // fields added by PlanServiceConfigModel
  icon: 'assets/subscription/icons/services/default.svg',
  hasDetail: false,
  description: {
    text: '',
    keywords: [],
  },
  detail: undefined,
  managementDescription: undefined,
  managementDescriptionDetail: undefined,
};

// ---------- HELPERs ----------
function getDefaultIconForType(type: SERVICES_TYPE): string {
  const map: Partial<Record<SERVICES_TYPE, string>> = {
    [SERVICES_TYPE.CREDIT]: 'assets/subscription/icons/services/credit-fill.svg',
    [SERVICES_TYPE.BNPL_1PAY]: 'assets/subscription/icons/services/bnpl-fill.svg',
    [SERVICES_TYPE.BNPL_4PAY]: 'assets/subscription/icons/services/bnpl-fill.svg',
    [SERVICES_TYPE.COIN]: 'assets/subscription/icons/services/coin-fill.svg',
    [SERVICES_TYPE.CASHBACK]: 'assets/subscription/icons/services/cashback-fill.svg',
    [SERVICES_TYPE.H_WEALTH]: 'assets/subscription/icons/services/wealth-fill.svg',
    [SERVICES_TYPE.PURCHASE_CASHBACK]: 'assets/subscription/icons/services/store-fill.svg',
    [SERVICES_TYPE.DPCARD_ISUUANCE]: 'assets/subscription/icons/services/dp-card-fill.svg',
    [SERVICES_TYPE.H_AFFORDABLE_INSURANCE]: 'assets/subscription/icons/services/insurance-fill.svg',
    [SERVICES_TYPE.H_COMPREHENSIVE_INSURANCE]: 'assets/subscription/icons/services/insurance-fill.svg',
    [SERVICES_TYPE.H_FULL_INSURANCE]: 'assets/subscription/icons/services/insurance-fill.svg',
    [SERVICES_TYPE.H_BEYOND_INSURANCE]: 'assets/subscription/icons/services/insurance-fill.svg',
    [SERVICES_TYPE.H_SUPPORT]: 'assets/subscription/icons/services/support-fill.svg',
    [SERVICES_TYPE.H_DISCOUNT_STORES]: 'assets/subscription/icons/services/store-fill.svg',
    // add others as needed
  };
  return map[type] ?? DEFAULT_PLAN_SERVICE_CONFIG.icon;
}

// small helper to build a fully typed PlanServiceConfigModel by merging defaults,
// the incoming service (PlanServices) and overrides (type-safe Partial).
function buildConfigFrom(service: PlanServices, overrides?: Partial<PlanServiceConfigModel>): PlanServiceConfigModel {
  // Spread: defaults first -> service fields -> overrides
  // Because DEFAULT_PLAN_SERVICE_CONFIG already has all required fields,
  // the resulting object satisfies PlanServiceConfigModel type.
  const merged: PlanServiceConfigModel = {
    ...DEFAULT_PLAN_SERVICE_CONFIG,
    ...service, // PlanService fields overlap and will overwrite defaults where present
    ...overrides,
  };
  return merged;
}

// ---------- minimal config map (handlers) ----------
const serviceConfigMap: Partial<Record<SERVICES_TYPE, (service: PlanServices) => PlanServiceConfigModel>> = {
  [SERVICES_TYPE.CREDIT]: (service) =>
    buildConfigFrom(service, {
      title: 'وام خرید کالا',
      icon: getDefaultIconForType(SERVICES_TYPE.CREDIT),
      hasDetail: true,
      description: {
        text: `امکان دریافت وام تا سقف ${formatPriceToString(+service.amount)} با توجه به نتیجه اعتبارسنجی‌ بانکی`,
        keywords: [formatPriceToString(+service.amount)],
      } as PlanServiceDescription,
    }),

  [SERVICES_TYPE.H_BNPL_4PAY]: (service) =>
    buildConfigFrom(service, {
      title: 'اعتبار ۴ قسطه',
      icon: getDefaultIconForType(SERVICES_TYPE.BNPL_4PAY),
      hasDetail: true,
      description: {
        text: `${service.amount ? `افزایش اعتبار ویژه‌ی خرید تا سقف ${formatPriceToString(+service.amount)}` : 'افزایش اعتبار ویژه‌ی خرید'}`,
        keywords: [''],
      },
    }),
  [SERVICES_TYPE.BNPL_4PAY]: (service) =>
    buildConfigFrom(service, {
      title: 'اعتبار ۴ قسطه',
      icon: getDefaultIconForType(SERVICES_TYPE.BNPL_4PAY),
      hasDetail: true,
      description: {
        text: `${service.amount ? `افزایش اعتبار ویژه‌ی خرید تا سقف ${formatPriceToString(+service.amount)}` : 'افزایش اعتبار ویژه‌ی خرید'}`,
        keywords: [''],
      },
    }),

  // reuse handler for BNPL_4PAY

  [SERVICES_TYPE.H_BNPL_1PAY]: (service) =>
    buildConfigFrom(service, {
      title: 'الان بخر، بعدا پرداخت کن',
      icon: getDefaultIconForType(SERVICES_TYPE.BNPL_1PAY),
      hasDetail: true,
      description: {
        text: `دریافت ${formatPriceToString(+service.amount)} اعتبار ویژه‌ی خدمات مالی روزانه، اول هر ماه`,
        keywords: [formatPriceToString(+service.amount)],
      },
    }),
  [SERVICES_TYPE.BNPL_1PAY]: (service) =>
    buildConfigFrom(service, {
      title: 'الان بخر، بعدا پرداخت کن',
      icon: getDefaultIconForType(SERVICES_TYPE.BNPL_1PAY),
      hasDetail: true,
      description: {
        text: `دریافت ${formatPriceToString(+service.amount)} اعتبار ویژه‌ی خدمات مالی روزانه، اول هر ماه`,
        keywords: [formatPriceToString(+service.amount)],
      },
    }),

  [SERVICES_TYPE.COIN]: (service) =>
    buildConfigFrom(service, {
      title: 'سکه‌ی پی‌کلاب',
      icon: getDefaultIconForType(SERVICES_TYPE.COIN),
      hasDetail: false,
      description: {
        text: `دریافت آنی ${service.amount} سکه پی‌کلاب برای شرکت در قرعه‌کشی‌ها و دریافت هدایای پی‌کلاب`,
        keywords: [`${service.amount} سکه`],
      },
    }),
  [SERVICES_TYPE.H_DISCOUNT_STORES]: (service) =>
    buildConfigFrom(service, {
      icon: getDefaultIconForType(SERVICES_TYPE.H_DISCOUNT_STORES),
      title: 'تخفیف‌های ویژه‌ی فروشگاه‌ها',
      hasDetail: true,
      description: {
        text: 'ارائه تخفیف‌ها و پیشنهادات ویژه در فروشگاه‌های منتخب',
        keywords: [`یک ماه`],
      },
    }),

  [SERVICES_TYPE.H_FULL_INSURANCE]: (service) =>
    buildConfigFrom(service, {
      title: 'بیمه‌ی سرقت و خرابی موبایل',
      icon: getDefaultIconForType(SERVICES_TYPE.H_FULL_INSURANCE),
      hasDetail: true,
      description: {
        text: `امکان خرید بیمهٔ یکسالهٔ موبایل با سقف ارزشی  ${formatPriceToString(+service.amount)} و پوشش حداکثری خسارات ناشی از هر نوع سرقت و حوادث منجر به آسیب فیزیکی به دستگاه.`,
        keywords: ['حوادث منجر به آسیب فیزیکی', 'هر نوع سرقت', 'پوشش حداکثری', `${formatPriceToString(+service.amount)}`],
      },
    }),
  [SERVICES_TYPE.H_AFFORDABLE_INSURANCE]: (service) =>
    buildConfigFrom(service, {
      title: 'بیمه به‌صرفه‌',
      icon: getDefaultIconForType(SERVICES_TYPE.H_AFFORDABLE_INSURANCE),
      hasDetail: true,
      description: {
        text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با پوشش حداکثری خسارت ناشی از هر نوع سرقت.',
        keywords: ['هر نوع سرقت.'],
      },
    }),

  [SERVICES_TYPE.H_COMPREHENSIVE_INSURANCE]: (service) =>
    buildConfigFrom(service, {
      title: 'بیمه جامع',
      icon: getDefaultIconForType(SERVICES_TYPE.H_COMPREHENSIVE_INSURANCE),
      hasDetail: true,
      description: {
        text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با پوشش حداکثری خسارت ناشی از هر نوع سرقت یا از دست رفتن کامل دستگاه بر اثر هر نوع حادثه.',
        keywords: ['هر نوع سرقت', 'از دست رفتن کامل دستگاه بر اثر هر نوع حادثه.'],
      },
    }),
  [SERVICES_TYPE.DPCARD_ISUUANCE]: (service) =>
    buildConfigFrom(service, {
      title: 'کارت فیزیکی دیجی‌پی',
      icon: getDefaultIconForType(SERVICES_TYPE.DPCARD_ISUUANCE),
      hasDetail: false,
      description: {
        text: `دریافت دیجی‌کارت با امکان خرید از تمام فروشگاه‌های حضوری در سطح کشور به همراه برگشت ‌پول`,
        keywords: [''],
      },
    }),
  [SERVICES_TYPE.PURCHASE_CASHBACK]: (service) =>
    buildConfigFrom(service, {
      title: 'برگشت پول با خرید از کیف پول با دیجی‌کارت',
      icon: getDefaultIconForType(SERVICES_TYPE.PURCHASE_CASHBACK),
      hasDetail: false,
      description: {
        text: ` بهره‌مندی از برگشت پول ${service.cashbackPercentage ?? 10}٪ تا سقف ${formatPriceToString(+service.maxCashbackPerPlan ? +service.maxCashbackPerPlan : 10000)} به کیف پول با هر خرید از فروشگاه‌های دیجی‌پی`,
        keywords: [` برگشت پول ${service.cashbackPercentage ?? 10}٪`],
      },
    }),
  [SERVICES_TYPE.H_WEALTH]: (service) =>
    buildConfigFrom(service, {
      title: 'مشاوره سرمایه‌گذاری',
      icon: getDefaultIconForType(SERVICES_TYPE.H_WEALTH),
      hasDetail: true,
      description: {
        text: `${service.amount} ماه مشاوره و مدیریت پرتفوی سرمایه‌گذاری`,
        keywords: [`${service.amount} ماه`],
      },
    }),
  [SERVICES_TYPE.H_SUPPORT]: (service) =>
    buildConfigFrom(service, {
      title: 'پشتیبانی ویژه',
      icon: getDefaultIconForType(SERVICES_TYPE.H_SUPPORT),
      hasDetail: false,
      description: {
        text: 'پشتیبانی اختصاصی و ویژه ۲۴ ساعته در تمام هفته',
        keywords: [''],
      },
    }),

  [SERVICES_TYPE.CASHBACK]: (service) =>
    buildConfigFrom(service, {
      title: 'برگشت ‌پول با خرید شارژ و بسته اینترنت',
      icon: getDefaultIconForType(SERVICES_TYPE.CASHBACK),
      hasDetail: false,
      description: {
        text: `امکان برگشت پول  ۱۰٪ تا سقف ۳۰۰ هزار تومان به کیف پول`,
        keywords: [`برگشت پول  ۱۰٪`],
      },
    }),
  [SERVICES_TYPE.H_BEYOND_INSURANCE]: (service) =>
    buildConfigFrom(service, {
      title: 'فراتر از بیمه',
      icon: getDefaultIconForType(SERVICES_TYPE.H_BEYOND_INSURANCE),
      hasDetail: true,
      description: {
        text: 'امکان خرید بیمهٔ یکسالهٔ موبایل و سایر تجهیزات الکترونیک با تعهد تعمیر یا تعویض دستگاه در صورت بروز هر نوع حادثه با پوشش کامل هر‌گونه هزینه.',
        keywords: ['تعهد تعمیر یا تعویض دستگاه', 'با پوشش کامل هر‌گونه هزینه.'],
      },
    }),

  // ... add other handlers similarly ...
  [SERVICES_TYPE.MERCHANT_CASHBACK]: (service) =>
    buildConfigFrom(service, {
      title: service.merchantCashbackList?.[0]?.businessTitle ?? '',
      icon: getDefaultIconForType(service.type),
      hasDetail: false,
      managementDescription: {
        text: generateManagementDescription(service.merchantCashbackList ?? []),
        keywords: [],
      },
      managementDescriptionDetail: {
        text: generatePayDescription(service.merchantCashbackList?.[0]?.paymentGateway ?? []),
        keywords: [],
      },
      description: generateCashbackDescription(
        service.merchantCashbackList?.[0]?.paymentGateway ?? [],
        service.merchantCashbackList?.[0]?.businessTitle ?? '',
      ),
    }),
};

// ---------- MAIN FUNCTION ----------
export function generateServiceConfig(service: PlanServices): PlanServiceConfigModel {
  const handler = serviceConfigMap[service.type];
  let config: PlanServiceConfigModel;

  if (handler) {
    config = handler(service);
  } else {
    // fallback: merge defaults with incoming service so required fields exist
    config = buildConfigFrom(service, {
      title: service.title ?? '',
      icon: getDefaultIconForType(service.type),
      hasDetail: false,
      description: {
        text: '',
        keywords: [],
      },
    });
  }

  // special case: multiple merchant cashback stores -> override with a different structure
  if (service.type === SERVICES_TYPE.MERCHANT_CASHBACK && service.merchantCashbackList && service.merchantCashbackList.length > 1) {
    const concatValue = concatStoreNames(service.merchantCashbackList);

    config = buildConfigFrom(service, {
      title: 'فروشگاه‌های منتخب',
      icon: 'assets/subscription/icons/services/store-fill.svg',
      hasDetail: true,
      description: concatPayMethod(service.merchantCashbackList),
      managementDescription: {
        text: `هدیه نقدی ویژه در ${concatValue}`,
        keywords: [concatValue],
      },
      detail: {
        title: 'هدیه نقدی',
        subtitle: 'در فروشگاه‌های منتخب دیجی‌پی',
        icon: 'assets/subscription/icons/services/store-fill.svg',
        contents: [
          {
            points: [`هدیه نقدی ویژه در ${concatValue}`, 'واریز هدیه نقدی پس از خرید به کیف پول دیجی‌پی'],
          },
        ],
      } as PlanServiceConfigDetail,
    });
  }

  return config;
}
