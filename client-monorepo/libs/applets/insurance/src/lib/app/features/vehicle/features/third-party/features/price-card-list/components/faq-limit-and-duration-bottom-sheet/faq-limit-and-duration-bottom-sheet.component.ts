import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { AccordionComponent } from '../../../../../../../../components/accordion/accordion.component';
import { AccordionModel } from '../../../../../../../../data-access/models/accordion.model';
import { InfoBoxComponent } from '../../../../../../components/info-box/info-box.component';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { InsAlertComponent } from '../../../../../../../../components/ins-alert/ins-alert.component';
import { AlertSizeEnum } from '../../../../../../../../data-access/enums/alert-size.enum';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';

@Component({
  selector: 'faq-limit-and-duration-bottom-sheet',
  standalone: true,
  imports: [
    AccordionComponent,
    InfoBoxComponent,
    InsAlertComponent,
    ActionButtonsComponent
  ],
  templateUrl: './faq-limit-and-duration-bottom-sheet.component.html',
  styleUrl: './faq-limit-and-duration-bottom-sheet.component.scss'
})
export class FaqLimitAndDurationBottomSheetComponent extends BaseComponent {
  constructor() {
    super();
  }

  private bottomSheetRef = inject(MatBottomSheetRef<FaqLimitAndDurationBottomSheetComponent>);
  protected accordionItems: Array<AccordionModel> = [
    {
      id: 0,
      title: 'تعهد جانی به چه معناست؟',
      description: 'منظور از تعهدات جانی، تعهداتی است که شرکت بیمه در برابر خسارات وارده به بدن و جان اشخاص زیان‌دیده (به جز راننده) بر عهده دارد. مبلغ تعهد جانی ثابت بوده و در هر سال برابر میزان دیه است و برای سال جاری معادل ۱ میلیارد و ۶۰۰ میلیون تومان است.'
    },
    {
      id: 1,
      title: 'تعهد راننده به چه معناست؟',
      description: 'منظور از تعهدات راننده، تعهداتی است که شرکت بیمه در برابر خسارات وارده به بدن و جان راننده خودرو بر عهده دارد و مبلغ آن ثابت بوده و برای سال جاری معادل ۱ میلیارد و ۲۰۰ میلیون تومان است.'
    },
    {
      id: 2,
      title: 'تعهد مالی به چه معناست؟',
      description: 'منظور از تعهد مالی، حداکثر هزینه‌ای است که شرکت بیمه در برابر خسارات وارده به اموال اشخاص زیان‌دیده (به جز راننده) بر عهده می‌گیرد. به عنوان مثال اگر خسارت وارد شده در تصادف ۱۵۰ میلیون تومان باشد و تعهد مالی بیمه ۴۰ میلیون تومان باشد، ۱۱۰ میلیون باقیمانده را فرد مقصر باید پرداخت کند.'
    },
    {
      id: 3,
      title: 'چه میزان تعهد مالی برای من مناسب است؟',
      description: 'در هر حادثه که شما مقصر آن باشید و منجر به خسارت مالی به اشخاص دیگر شود، شرکت بیمه فقط متعهد به پرداخت خسارتی معادل میزان پوشش مالی انتخاب شده است. بنابراین در حوادثی که خسارت مالی وارد شده بیش از پوشش انتخابی باشد، شما باید باقی خسارت را شخصاً پرداخت کنید. به همین دلیل انتخاب مطمئن‌تر، تعهد مالی بالاتر است.'
    },
    {
      id: 4,
      title: 'در چه شرایطی نیاز است تعهد مالی را تغییر دهم؟',
      description: 'نرخ دیه در ابتدای هر سال جدید تعیین شده و با توجه به آن، سقف تعهد مالی همه شرکت‌های بیمه مجددا محاسبه می‌شود. در صورتی که سفارش شما امسال ثبت شده باشد، اما صدور آن در سال جدید انجام شود، نیاز است تعهد مالی را از بین موارد تعیین شده برای سال جدید انتخاب کرده و مبلغ مابه‌التفاوت آن را پرداخت کنید.'
    },
    {
      id: 5,
      title: 'چرا قیمت بیمه در شرکت‌های بیمه‌گر متفاوت است؟',
      description: 'تفاوت قیمت بیمه‌ها به دلیل تنوع طرح‌های تخفیفی و خدمات شرکت‌های بیمه است. شما می‌توانید خدمات، تخفیفات و دیگر ویژگی‌های مورد نظر خودر را در لیست بیمه‌های دیجی‌پی مشاهده و مقایسه کنید و در صورت نیاز برای انتخاب بیمه مناسب و اطمینان از کیفیت خدمات، نظرات و تجربیان مشتریان دیجی‌پی را مرور کنید.'
    },
    {
      id: 6,
      title: 'زمان صدور و شروع بیمه‌نامه چه زمانی است؟',
      description: 'اگر بیمه‌نامه خود را قبل از ساعت ۲۱ خریداری و اطلاعات آن را کامل کنید، ظرف یک روز کاری صادر و آماده دانلود خواهد شد. این بیمه‌نامه بعد از پایان اعتبار بیمه قبلی فعال می‌شود، مگر اینکه بیمه قبلی منقضی شده باشد که در این صورت، از فردای روز صدور فعال خواهد شد.'
    },
    {
      id: 7,
      title: 'شرایط انتقال تخفیف بیمه شخص ثالث چگونه است؟',
      description: 'امکان انتقال تخفیف بیمه‌ شخص ثالث بین دو خودرو در صورتی وجود دارد که پلاک، سند و بیمه‌نامه‌ی هر دو خودرو به نام یک‌نفر باشد و نوع خودروها نیز یکسان باشد.( مثلاً امکان انتقال تخفیف سواری به وانت وجود ندارد.) همچنین تخفیف بیمه‌نامه خودرو بین افراد درجه یک خانواده یعنی والدین، همسر و فرزندان نیز قابل انتقال است.'
    },
  ];
  protected readonly IconEnum = IconEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;

  handleActiveButtonClicked(): void {
    this.bottomSheetRef.dismiss();
  }
}
