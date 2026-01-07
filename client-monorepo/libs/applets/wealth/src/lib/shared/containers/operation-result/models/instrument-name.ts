export const INSTRATION_NAME = new Map<string, string>([
  ['IRT1SKDF0001', 'تجارت شاخصی کاردان'],
  ['IRTKLOTF0001', 'پشتوانه طلای لوتوس'],
  ['IRT3SSSF0001', 'سپهر سودمند سینا'],
  ['IRT1KRIN0001', 'نگین سامان'],
  ['IRTKGANJ0001', 'کیمیا زرین کاردان'],
  ['11421', 'ارزش آفرین گلبرگ'],
  ['11997', 'شکوه اوج دماوند'],
  ['11394', 'پاداش سرمایه بهگزین'],
  ['10883', 'بانک گردشگری'],
  ['IPO-DIGIKALA', 'دیجی‌کالا'],
  ['IRO3AKHZ0001', 'اخشان'],
  ['IRO3IKSZ0001', 'خیمن'],
  ['IRT1AFAG0001', 'افق آتی'],
  ['IRT3FKOF0001', 'آرمان آتی کوثر'],
  ['11', 'تأمین سرمایه در گردش جهت تولید شارژر توکار بی یو سی 3'],
  ['IRO5MOMS0001', 'مهرمام'],
  ['IRT3AKMF0001', 'ثابت آکام'],
  ['IRT3SOVF0001', 'ثبات ویستا'],
  ['IRTKZARV0001', 'زروان ویستا'],
  ['IRT3KAAF0001', 'کامیاب آشنا'],
  ['IRT1VBAZ0001', 'بازار آشنا'],
]);

export function getInstrumentName(symbol: string): string | undefined {
  return INSTRATION_NAME.get(symbol);
}
