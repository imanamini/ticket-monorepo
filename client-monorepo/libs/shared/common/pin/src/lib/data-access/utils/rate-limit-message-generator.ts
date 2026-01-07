export function generateRateLimitMessage(remainingAttempts: number, attemptsResetTime: number): string {
  switch (remainingAttempts) {
    case 0:
      return `آخرین فرصت: در صورت ورود رمز اشتباه،
حساب شما به مدت ${attemptsResetTime} دقیقه مسدود خواهد شد`;
    case 1:
      return 'هشدار: تنها ۲ تلاش دیگر برای ورود رمز صحیح دارید';
    case 2:
      return `رمز اشتباه است. در صورت ۳ تلاش ناموفق دیگر،
حساب شما موقتا مسدود خواهد شد`;
    case 3:
      return 'رمز وارد شده اشتباه است، ۴ تلاش دیگر باقی‌مانده';
    default:
      return 'رمز وارد شده اشتباه است،';
  }
}
