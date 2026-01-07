import { Component, Input } from '@angular/core';
import { ContactForm } from '../../../../../../api/clients/models/templates/contact-us/contact-form';
import { Router } from '@angular/router';
import { UiDialogSimpleComponent } from '../../../../../../ui/ui-components/ui-dialogs/ui-dialog-simple/ui-dialog-simple.component';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { ContactFormComponent } from '../../../../../../ui/ui-components/ui-contact/contact-form/contact-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-working-capital-request-form',
  templateUrl: './working-capital-request-form.component.html',
  styleUrls: ['./working-capital-request-form.component.scss'],
  standalone: true,
  imports: [NgIf, ContactFormComponent],
})
export class WorkingCapitalRequestFormComponent {
  @Input() contactForm!: ContactForm;
  @Input() title = '';
  @Input() description = '';

  constructor(
    private router: Router,
    private dialog: DialogBottomSheetService,
  ) {}

  closeDialogButton(dialogData: { formValue: any; showDocuments: boolean }): void {
    const data = {
      hideIcon: true,
      title: dialogData.formValue.seller_type === 'حقیقی' ? 'مدارک مشتریان حقیقی' : 'مدارک مشتریان حقوقی',
      description:
        dialogData.formValue.seller_type === 'حقیقی'
          ? `<ol>
        <li>اصل شناسنامه و کپی تمام صفحات شناسنامه وام گیرنده</li>
        <li>اصل کارت ملی و کپی پشت و روی کارت ملی وام گیرنده</li>
        <li>اصل و کپی کارت پایان خدمت برای آقایان</li>
        <li>مستندات محل سکونت  و کپی</li>
        <li>به روزرسانی کدپستی در سامانه استعلام کدپستی www.ncr.ir</li>
        <li>درصورت داشتن کسب وکار شخصی ارایه اجاره نامه یا سندمالکیت محل فعالیت و ارایه جواز کسب یا استشهاد محلی</li>
        <li>اظهارنامه مالیاتی ( دو – سه ساله )</li>
        <li>مستند دارایی ها  (سند واحد تجاری / مسکونی / زمین / سهام و غیره )(مورد 8 برای این جرنی اجباری نیست.)  </li>
    </ol>`
          : `
    <ol>
      <li>مدارک هویت (شناسنامه و کارت ملی جدیدو کارت پایان خدمت )مربوط به کلیه مدیران و سهامداران بالای 10درصد-اصل وکپی</li>
      <li>اساسنامه شرکت-اصل و کپی</li>
      <li>آگهی تاسیس و اظهارنامه ثبت شرکت –اصل و کپی</li>
      <li>مجوز فعالیت(پروانه بهره برداری و کارت بازرگانی)-اصل و کپی</li>
      <li>روزنامه تغییرات شرکت شامل روزنامه آخرین مدیران معتبر،آخرین محل شرکت و کارخانه وآخرین سرمایه ثبتی شرکت</li>
      <li>مدارک محل شرکت و کارخانه و انبار_سند یا اجاره نامه دارای اعتبار که آدرس با آگهی های مربوطه مطابقت داشته باشد_اصل و کپی</li>
      <li>صورتهای مالی حسابرسی شده دو سال اخیر</li>
      <li>اظهارنامه مالیاتی دوسال اخیر که صفحات ترازنامه و صورت سود و زیان آنها دارای مهروامضای شرکت باشد</li>
      <li>تراز آزمایشی ماه گذشته</li>
    </ol>
    `,
    };

    if (!dialogData.showDocuments) {
      this.navigateWithInfo();
      return;
    }
    this.dialog
      .open(UiDialogSimpleComponent, {
        templateData: data,
        minWidth: '500px',
        maxWidth: '80vw',
      })
      .then(() => {
        this.navigateWithInfo();
      });
  }

  navigateWithInfo() {
    this.router
      .navigate([], {
        queryParams: {
          nationalCode: null,
          birthDate: null,
        },
        queryParamsHandling: 'merge',
      })
      .then(() => {
        window.location.reload();
      });
  }
}
