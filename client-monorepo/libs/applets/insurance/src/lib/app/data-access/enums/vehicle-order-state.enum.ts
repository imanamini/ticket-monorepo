export enum VEHICLE_ORDER_STATE_ENUM {
  // جدید
  DRAFT = 'Draft',
  // نحوه پرداخت
  CHECKOUT = 'Checkout',
  // در انتظار پرداخت
  PENDING_PAYMENT = 'PendingPayment',
  // پرداخت شده
  PAID = 'Paid',
  // تکمیل اطلاعات
  USER_INFO_COMPLETED = 'UserInfoCompleted',
  // آپلود مدارک
  DOCUMENTS_UPLOADED = 'DocumentsUploaded',
  // درج آدرس
  ADDRESS_INSERTED = 'AddressInserted',
  // روش دریافت
  DELIVERY_METHOD_INSERTED = 'DeliveryMethodInserted',
  // ابطال سیستمی
  REFUSED = 'Refused',
  // در حال آماده سازی
  PROVISIONING = 'Provisioning',
  // در انتظار بررسی
  PENDING_REVIEW = 'PendingReview',
  // بررسی شده
  REVIEWED = 'Reviewed',
  // در انتظار رفع مشکل مدارک
  DOCUMENTS_CONFLICT = 'DocumentsConflict',
  // در انتظار رفع مغایرت قیمت
  PRICE_CONFLICT = 'PriceConflict',
  // نیاز به ثبت در سامانه اسکان
  WAITING_FOR_POSTAL_CODE = 'WaitingForPostalCode',
  // ثبت شده در سامانه اسکان
  VERIFY_POSTAL_CODE = 'VerifyPostalCode',
  // در انتظار صدور
  PENDING_ISSUANCE = 'PendingIssuance',
  // صادر شده
  ISSUED = 'Issued',
  // کنسل شده
  CANCELLED = 'Cancelled',
  // منقضی شده
  EXPIRED = 'Expired',
}
