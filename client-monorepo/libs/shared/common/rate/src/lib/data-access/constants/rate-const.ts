export enum DeliveryFeedBacks {
  DELIVERED = 'DELIVERED',
  NOT_DELIVERED = 'NOT_DELIVERED',
}

export enum DELIVERED_CHIPS {
  POOR_SERVICE_QUALITY = 'کیفیت نامناسب خدمات',
  POOR_SUPPORT = 'پشتیبانی ضعیف',
  STORE_VIOLATION = 'تخلف فروشگاه',
  STORE_HIGH_PRICES = 'قیمت‌های بالای فروشگاه',
  DIFFICULT_PURCHASE_PROCESS = 'راحت نبودن فرایند خرید',
  OTHER = 'دلایل دیگر',
}

export enum NOT_DELIVERED_CHIPS {
  LATE_DELIVERY = 'تاخیر در سفارش',
  CANCEL_ORDER = 'لغو سفارش',
  DELIVERY_DATE_NOT_MET = 'نرسیدن موعد تحویل',
}
