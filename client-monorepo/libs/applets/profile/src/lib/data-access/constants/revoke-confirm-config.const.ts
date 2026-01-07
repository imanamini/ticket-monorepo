export const REVOKE_CONFIRM_CONFIG = {
  single: {
    title: 'آیا از حذف دستگاه مطمئن هستید؟',
    description: 'با حذف این دستگاه از لیست، دسترسی به حساب دیجی‌پی از طریق آن غیرفعال می‌شود.',
    buttons: [
      {
        id: 'secondary',
        style: 'tinted-on-elevated',
        mode: 'form',
        label: 'لغو',
        fullWidth: true,
      },
      {
        id: 'primary',
        style: 'fill',
        mode: 'form',
        label: 'غیر فعال کردن',
        fullWidth: true,
      },
    ],
  },
  others: {
    title: 'آیا مطمئن هستید؟',
    description: 'با غیر فعال کردن باقی دستگاه‌ها، دسترسی شما به حساب دیجی‌پی فقط با همین دستگاه خواهد بود.',
    buttons: [
      {
        id: 'secondary',
        style: 'tinted-on-elevated',
        mode: 'form',
        label: 'لغو',
        fullWidth: true,
      },
      {
        id: 'primary',
        style: 'fill',
        mode: 'form',
        label: 'غیر فعال کردن باقی دستگاه‌ها',
        fullWidth: true,
      },
    ],
  },
};
