import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LandingFooterComponent } from '../../components/footer/footer.component';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '../../../../data-access/constants/app-routes';

import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LandingFooterComponent, NgxButtonComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements OnDestroy {
  faqItems = [
    {
      question: 'صندوق درامد ثابت چیست؟"',
      answer:
        'کم‌ریسک‌ترین روش سرمایه‌گذاری در بورس می‌باشد. در صندوق‌های درامد ثابت خرید و فروش واحدها به‌صورت آنلاین انجام می‌شود.  بازدهی سالانه صندوق درامد ثابت در سال‌های اخیر به‌طور متوسط ۲۶ درصد بوده است. در این صندوق‌ها سود به‌صورت روزشمار محاسبه و هر ماه در تاریخ مشخصی به حساب بانکی سجامی شما واریز می‌شود؛ بنابراین می‌توانید روی این سود به‌عنوان درامد ماهانه مطمئن حساب کنید. با توجه به نقدشوندگی بالای این صندوق‌ها، هر زمانی که تصمیم بگیرید، می‌توانید تمام یا بخشی از سرمایه خود را به وجه نقد تبدیل کنید',
      isExpanded: false,
    },
    {
      question: 'ریسک سرمایه‌گذاری در صندوق‌های درامد ثابت چقدر است؟',
      answer:
        'با توجه به این‌که بیشتر دارایی این صندوق‌ها در اوراق مشارکت و سپرده بانکی سرمایه‌گذاری می‌شود، سرمایه‌گذاری در آنها ریسک پایینی دارد',
      isExpanded: false,
    },
    {
      question: 'نحوه سرمایه‌گذاری در این صندوق‌ها چگونه است؟',
      answer:
        'سرمایه‌گذاری در این صندوق‌ها با داشتن کد سجام و به صورت آنلاین در اپلیکیشن دیجی‌پی انجام می‌شود.برای سرمایه‌گذاری در صندوق، باید واحدھای آن را خریداری کنید که قیمت ھر واحد در صفحه اصلی سرمایه‌گذاری دیجی‌پی موجود است. با کلیک روی دکمه سرمایه‌گذاری و انتخاب تعداد واحد مورد نظر، به صفحه پرداخت منتقل می‌شوید.سرمایه‌گذاری شما حداکثر تا دو روز کاری نهایی می‌شود و به دارایی شما افزوده خواھد شد',
      isExpanded: false,
    },
    {
      question: 'آیا دیجی‌پی کارمزد دریافت می‌کند؟',
      answer: 'در فرایند خرید و فروش، دیجی‌پی هیچگونه کارمزدی دریافت نمی‌کند',
      isExpanded: false,
    },
    {
      question: 'حداقل مبلغ قابل سرمایه‌گذاری چقدر است؟',
      answer: 'کم‌ترین مبلغ مورد نیاز برای سرمایه‌گذاری در صندوق درامد ثابت به میزان قیمت روز ۱ واحد از آن صندوق است',
      isExpanded: false,
    },
  ];

  sections = {
    steps: 'steps',
    sejam: 'sejam',
    faq: 'faq',
  };
  navigationService = inject(WealthNavigationService);

  constructor() {
    const layout = document.getElementsByClassName('main-layout');
    if (layout.length > 0) {
      layout[0].classList.remove('main-layout');
    }
  }

  switchExpand(value, index) {
    this.faqItems[index].isExpanded = !value;
  }

  goToRegister() {
    this.navigationService.navigate([REGISTER_ROUTE]);
  }

  goToLogin() {
    this.navigationService.navigate([LOGIN_ROUTE]);
  }

  registerSejam() {
    window.open('https://profilesejam.csdiran.ir/', '_blank');
  }

  goToDownloadPage() {
    window.open('https://www.digipay.ir/download/');
  }

  scrollToElement(section): void {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    const layout = document.getElementsByClassName('main');
    if (layout.length > 0) {
      layout[0].classList.add('main-layout');
    }
  }
}
