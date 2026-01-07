import { ViolationBottomSheetItemModel, ViolationPurchaseStatusModel, ViolationReasonModel } from '../models/violation.model';
import { ViolationStoresComponent } from '../../components/violation-stores/violation-stores.component';
import { ViolationPurchasesComponent } from '../../components/violation-purchases/violation-purchases.component';
import { ViolationReasonComponent } from '../../components/violation-reason/violation-reason.component';
import { ViolationDocumentsComponent } from '../../components/violation-documents/violation-documents.component';
import { StoreType } from '@client-monorepo/stores';

export enum ViolationPurchaseStatus {
  PURCHASED = 'PURCHASED',
  NOT_PURCHASED = 'NOT_PURCHASED',
}

export const PurchaseStatusList: ViolationPurchaseStatusModel[] = [
  {
    id: '0',
    title: 'خرید کردم و به مشکل بر خوردم',
    status: ViolationPurchaseStatus.PURCHASED,
  },
  {
    id: '1',
    title: 'موفق به خرید نشدم / از خرید منصرف شدم',
    status: ViolationPurchaseStatus.NOT_PURCHASED,
  },
];

export enum ViolationStep {
  SELECT_STORE = 'SELECT_STORE',
  SELECT_PURCHASE = 'SELECT_PURCHASE',
  SELECT_REASON = 'SELECT_REASON',
  DESCRIPTION_AND_FILE = 'DESCRIPTION_AND_FILE',
}

export interface ViolationStepConfigModel {
  title?: string;
  description: string;
  component: any;
}

export const ViolationStepConfigMapper: Record<ViolationStep, ViolationStepConfigModel> = {
  [ViolationStep.SELECT_STORE]: {
    description: 'انتخاب نام فروشگاه',
    component: ViolationStoresComponent,
  },
  [ViolationStep.SELECT_PURCHASE]: {
    description: 'انتخاب خرید مورد نظر',
    component: ViolationPurchasesComponent,
  },
  [ViolationStep.SELECT_REASON]: {
    description: 'انتخاب دلیل گزارش',
    component: ViolationReasonComponent,
  },
  [ViolationStep.DESCRIPTION_AND_FILE]: {
    description: 'توضیحات و مستندات',
    component: ViolationDocumentsComponent,
  },
};

export const ViolationJourneyMapper: Record<ViolationPurchaseStatus, ViolationStep[]> = {
  [ViolationPurchaseStatus.PURCHASED]: [ViolationStep.SELECT_PURCHASE, ViolationStep.SELECT_REASON, ViolationStep.DESCRIPTION_AND_FILE],
  [ViolationPurchaseStatus.NOT_PURCHASED]: [ViolationStep.SELECT_STORE, ViolationStep.SELECT_REASON, ViolationStep.DESCRIPTION_AND_FILE],
};

export enum ViolationReasonTitles {
  ORDER_STATUS = 'ORDER_STATUS',
  PACKAGE_ISSUES = 'PACKAGE_ISSUES',
  PAYMENT_GATEWAY_ISSUES = 'PAYMENT_GATEWAY_ISSUES',
  FINANCIAL_ISSUES = 'FINANCIAL_ISSUES',
  OTHER = 'OTHER',
}

export enum ViolationReasonSummaryFields {
  SHOP = 'SHOP',
  DATE = 'DATE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  PRICE = 'PRICE',
  REFER_METHOD = 'REFER_METHOD',
}

export const ViolationReasonTitleMapper: Record<ViolationReasonTitles, ViolationReasonModel> = {
  [ViolationReasonTitles.ORDER_STATUS]: {
    title: 'وضعیت سفارش',
    items: [
      { text: 'تاخیر در تحویل کالا', clicked: false },
      { text: 'وضعیت سفارشم را نمی‌دانم', clicked: false },
      { text: 'ناموجود شدن پس از خرید', clicked: false },
      { text: 'ارسال به روش متفاوت', clicked: false },
    ],
    icon: { name: 'post-motor', iconSize: '20px' },
  },
  [ViolationReasonTitles.PACKAGE_ISSUES]: {
    title: 'مشکل بسته‌ی تحویلی',
    items: [
      { text: 'سفارشم کامل بدستم نرسیده', clicked: false },
      { text: 'کالا ایراد فنی دارد', clicked: false },
      { text: 'کالا مغایرت دارد', clicked: false },
      { text: 'کالا دارای آسیب‌دیدگی‌ است', clicked: false },
    ],
    icon: { name: 'delivery-box', iconSize: '20px' },
  },
  [ViolationReasonTitles.PAYMENT_GATEWAY_ISSUES]: {
    title: 'مشکل درگاه',
    items: [
      { text: 'درگاه پرداخت دیجی‌پی غیر فعال بود.', clicked: false },
      { text: 'برخورد بد', clicked: false },
      { text: 'اعتبار دیجی‌پی را قبول نکرد', clicked: false },
      { text: 'عدم وجود بنر دیجی‌پی در مراجعه حضوری', clicked: false },
    ],
    icon: { name: 'delivery-box', iconSize: '20px' },
  },
  [ViolationReasonTitles.FINANCIAL_ISSUES]: {
    title: 'مشکلات مالی',
    items: [
      { text: 'افزایش مبلغ پس از انتخاب درگاه دیجی‌پی', clicked: false },
      { text: 'تحمیل وجه اضافه یا شرایط جدید پس از فروش', clicked: false },
    ],
    icon: { name: 'bank-card', iconSize: '20px' },
  },
  [ViolationReasonTitles.OTHER]: {
    title: 'سایر',
    items: [{ text: 'سایر مشکلات', clicked: false }],
    icon: undefined,
  },
};

export const ViolationReasonSummaryMapper: Record<ViolationPurchaseStatus, ViolationReasonSummaryFields[]> = {
  [ViolationPurchaseStatus.PURCHASED]: [
    ViolationReasonSummaryFields.SHOP,
    ViolationReasonSummaryFields.DATE,
    ViolationReasonSummaryFields.PAYMENT_METHOD,
    ViolationReasonSummaryFields.PRICE,
  ],
  [ViolationPurchaseStatus.NOT_PURCHASED]: [ViolationReasonSummaryFields.SHOP, ViolationReasonSummaryFields.REFER_METHOD],
};

export const ViolationPaymentMethodsTitleMapper: Record<StoreType, string> = {
  [StoreType.ONSITE]: 'مراجعه حضوری',
  [StoreType.ONLINE]: 'وبسایت فروشگاه',
  [StoreType.SOCIAL_INSTAGRAM]: 'شبکه های اجتماعی',
};

export const ViolationBottomSheetItemsMapper: Record<StoreType, ViolationBottomSheetItemModel> = {
  [StoreType.ONSITE]: {
    id: '0',
    storeType: StoreType.ONSITE,
    title: ViolationPaymentMethodsTitleMapper[StoreType.ONSITE],
  },
  [StoreType.ONLINE]: {
    id: '1',
    storeType: StoreType.ONLINE,
    title: ViolationPaymentMethodsTitleMapper[StoreType.ONLINE],
  },
  [StoreType.SOCIAL_INSTAGRAM]: {
    id: '2',
    storeType: StoreType.SOCIAL_INSTAGRAM,
    title: ViolationPaymentMethodsTitleMapper[StoreType.SOCIAL_INSTAGRAM],
  },
};

export const PurchaseTypeToStoreTypeMapper: Record<string, StoreType> = {
  ONLINE: StoreType.ONLINE,
  OFFLINE: StoreType.ONSITE,
};
