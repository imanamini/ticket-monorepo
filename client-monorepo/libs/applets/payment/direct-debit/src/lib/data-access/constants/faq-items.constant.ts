import { AccordionComponent } from '../../components/accordion/accordion.component';
import { FaqCategoryTypeEnum } from '../model/faq-category-type.enum';
import { AccordionConfig } from '@digipay/ngx-accordion';

export const FAQ_ITEMS: Record<FaqCategoryTypeEnum, Partial<AccordionConfig<any>>[]> = {
  [FaqCategoryTypeEnum.DIRECT_DEBIT]: [
    {
      component: AccordionComponent,
      accordionTitle: 'پرداخت مستقیم چیست؟',
      inputs: {
        componentId: 'what-is-direct-debit',
        data: ` پرداخت مستقیم روشی امن برای پرداخت است که در آن شما به دیجی‌پی اجازه می‌دهید فقط تا سقف مشخصی، مبلغ پرداخت‌های دوره‌ای را از حساب بانکی‌تان برداشت کند. این روش باعث افزایش موفقیت پرداخت‌ها، کاهش خطا و مدیریت ساده‌تر پرداخت‌های منظم می‌شود.`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'آیا پرداخت مستقیم امن است؟',
      inputs: {
        componentId: 'is-direct-debit-secure',
        data: `بله. مجوز پرداخت مستقیم در بانک ثبت می‌شود و تمامی درگاه‌ها بر بستر امن پروتکل‌های بانکی و تحت نظارت بانک مرکزی انجام می‌شود. اطلاعات حساب شما محرمانه است و در اختیار دیجی‌پی قرار نمی‌گیرد. با توجه به اینکه در هر پرداخت نیاز به وارد کردن مجدد اطلاعات کارت بانکی نیست و همچنین به درگاه بانکی یا صفحه پرداخت نامعتبر هدایت نمی‌شوید، این روش امنیت کاملی را پیاده‌سازی می‌کند.`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'فرایند ایجاد مجوز برداشت مستقیم چگونه است؟',
      inputs: {
        componentId: 'how-to-create-direct-debit',
        data: `این فرایند کاملا آنلاین است. از طریق سوپر اپلیکیشن دیجی‌پی وارد بخش پرداخت مستقیم شوید. با انتخاب بانک مورد نظر و پذیرش شرایط به صفحه واسط بانک برای ایجاد مجوز پرداخت مستقیم وارد خواهید شد.`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'پیمان چیست؟',
      inputs: {
        componentId: 'what-is-faraboom',
        data: 'پیمان شرکت ارائه‌کننده راهکار پرداخت مستقیم در کشور ایران و طرف قرارداد دیجی‌پی هستند. دیجی‌پی از طریق سرویس‌های پیمان به بانک‌های مختلف متصل می‌شود. ',
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'سقف مبلغ روزانه در سرویس پرداخت مستقیم چقدر است؟',
      inputs: {
        componentId: 'direct-debit-daily-limit',
        data: `سقف مبلغ برداشت روزانه بستگی به بانک مورد نظر شما دارد و در زمان ایجاد به شما نمایش داده می‌شود`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'شارژ خودکار کیف پول چیست؟',
      inputs: {
        componentId: 'how-many-banks-support-direct-debit',
        data: `با فعال‌سازی شارژ خودکار، خیالتان راحت است که کیف پولتان همیشه موجودی دارد.
 هر زمان موجودی کیف پول شما از حدی که خودتان تعیین کرده‌اید کمتر شود، مبلغ دلخواهتان به‌صورت خودکار از حساب شما کسر و به کیف پول اضافه می‌شود؛ بدون وقفه در خرید و بدون دردسر.
در هر زمان هم می‌توانید مبلغ را تغییر دهید یا این قابلیت را غیرفعال کنید
`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'این سرویس از چند بانک پشتیبانی می‌کند؟',
      inputs: {
        componentId: 'how-to-change-or-delete-direct-debit',
        data: `در حال حاضر این سرویس ۱۲ بانک را پوشش می‌دهد. بانک‌های ملی، تجارت، ملت، سامان، پست بانک، ایران زمین، اقتصاد نوین، سینا، سرمایه، دی، مهر ایران و کشاورزی.`,
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'حذف یا تغییر پرداخت مستقیم چگونه انجام می‌شود؟',
      inputs: {
        componentId: 'is-possible-to-do-card-to-card-with-direct-debit',
        data: 'در سوپر اپلیکیشن دیجی‌پی وارد بخش پرداخت مستقیم شوید، آیکون سه نقطه را انتخاب کنید و گزینه ویرایش یا حذف را انتخاب نمایید.',
      },
      isOpen: false,
      showDivider: true,
    },
    {
      component: AccordionComponent,
      accordionTitle: 'آیا انجام کارت به کارت با روش پرداخت مستقیم، امکان پذیر است؟',
      inputs: {
        componentId: 'is-card-to-card-with-direct-debit',
        data: 'خیر در حال حاضر انجام تراکنش کارت به کارت با پرداخت مستقیم امکان پذیر نیست. ',
      },
      isOpen: false,
      showDivider: true,
    },
  ],
};
