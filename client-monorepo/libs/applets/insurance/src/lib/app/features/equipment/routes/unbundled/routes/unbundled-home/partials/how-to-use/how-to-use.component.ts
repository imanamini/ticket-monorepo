import { Component, OnInit } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { ScreenSizeEnum } from '../../../../../../enums/screen-size.enum';
import { LayoutService } from '../../../../../../../../data-access/services/layout.service';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
  imports: [
    ExpansionPanelComponent
  ],
  standalone: true
})
export class HowToUseComponent implements OnInit {

  title: string;

  size: ScreenSizeEnum;

  expansionData = [
    {
      title: 'فرق گارانتی و با پوشش‌های جبرانی چیه؟',
      description: [
        {
          text: '«بسته جبران» هزینه‌های مربوط به حوادثی که برای تجهیزات گوشی اتفاق می‌افته رو پوشش می‌ده، اما گارانتی برای عیب‌های ذاتی گوشیه.',
          hasBullet: false
        }
      ],
      id: 1,
      descriptionHeight: 95
    },
    {
      title: 'منظور از خسارات‌های جزئی و کلی چیه؟',
      description: [
        {
          text: 'خسارت جزئی شامل خیلی چیزها مثل شکستگی صفحه، آب‌خوردگی، نم‌دیدگی، ضربه و ... میشه، خسارت کلی مربوط به حوادثیه که منجر به از بین رفتن یا از کار افتادن گوشی مثل انهدام کامل دستگاه یا سرقت میشه',
          hasBullet: false
        }
      ],
      id: 2,
      descriptionHeight: 95
    },
    {
      title: 'فرانشیز چیه و چرا این بسته جبران نرخ‌هاش بهترینه؟',
      description: [
        {
          text: 'فرانشیز اون رقمیه که شما برای دریافت خدمات بسته جبرانی پرداخت میکنید که در این بسته جبران، نرخ اون برای هر مورد متفاوته:',
          hasBullet: false
        },
        {
          text: 'فرانشیز صدمات جزئی 10 درصده، یعنی تا 90 درصد هزینه‌ها رو بسته جبران می‌پردازه',
          hasBullet: true
        },
        {
          text: 'فرانشیز صدمات کلی 15 درصده، یعنی تا 85 درصد هزینه‌ها رو بسته جبران می‌پردازه',
          hasBullet: true
        },
        {
          text: 'فرانشیز سرقت 20 درصده، یعنی اگر گوشی‌تون سرقت بشه، تا 80 درصد پولش با بسته جبران بهتون بر میگرده',
          hasBullet: true
        },
      ],
      id: 3,
      descriptionHeight: 170
    },
    {
      title: 'آیا دیجی‌پی و دیجی‌کالا ضمانت کیفیت خدمات را انجام می‌دهند؟',
      description: [
        {
          text: 'ارائه‌دهنده سرویس بیمه پارسیان است و دیجی‌پی و دیجی‌کالا ضمانت‌دهنده خدمات هستند.',
          hasBullet: false
        }
      ],
      id: 4,
      descriptionHeight: 95
    },
    {
      title: 'در صورت خسارت، چگونه آنرا اعلام کنم؟',
      description: [
        {
          text: 'گام اول: تماس بگیرید',
          hasBullet: false
        },
        {
          text: 'ظرف حداکثر 5 روز بعد از بروز خسارت، باید به یکی از دو روش زیر اعلام خسارت کنید و حادثه را به دقت شرح دهید:',
          hasBullet: false
        },
        {
          text: 'تماس با شماره 61930000',
          hasBullet: true
        },
        {
          text: 'ارسال ایمیل به آدرس insurance@mydigipay.com',
          hasBullet: true
        },
        {
          text: 'گام دوم: تحویل دستگاه به نماینده دیجی‌پی',
          hasBullet: false
        },
        {
          text: 'پس از تماس و شرح حادثه، نماینده دیجی‌پی جهت دریافت گوشی خسارت دیده و یا جعبه و دیگر مدارک لازم به محل مورد نظر شما مراجعه خواهد کرد. در هنگام مراجعه نماینده دیجی‌پی، مدارک و مستندات زیر را ارائه دهید:',
          hasBullet: false
        },
        {
          text: 'دستگاه معیوب به همراه جعبه',
          hasBullet: true
        },
        {
          text: 'اصل کارت گارانتی (در صورتی که دستگاه دارای گارانتی باشد)',
          hasBullet: true
        },
        {
          text: 'سایر تجهیزات جانبی دستگاه از قبیل شارژ و ...',
          hasBullet: true
        },
      ],
      id: 5,
      descriptionHeight: 310
    },
    {
      title: 'درصورت سرقت گوشی چیکار کنم؟',
      description: [
        {
          text: 'گام اول: با پلیس 110 تماس بگیرید و اعلام سرقت کنید.',
          hasBullet: false
        },
        {
          text: 'گام دوم: با یکی از روش‌های ذکر شده در پاسخ سوال قبل، با ما تماس بگیرید.',
          hasBullet: false
        },
        {
          text: 'گام سوم: پس از مراجعه نماینده دیجی‌پی، مدارک و مستندات زیر را به او ارائه دهید:',
          hasBullet: false
        },
        {
          text: 'اصل گزارش تایید مراجع قضایی و انتظامی مرتبط با شکست حرز',
          hasBullet: true
        },
        {
          text: 'مدارک و مستندات پرونده تشکیل شده در دادسرا',
          hasBullet: true
        },
        {
          text: 'پرینت استعلام سرقت در سامانه همیاب',
          hasBullet: true
        },
        {
          text: 'استعلام عدم کشف از آگاهی، پس از 30 روز از تاریخ اعلام سرقت',
          hasBullet: true
        },
        {
          text: 'جعبه و تجهیزات جانبی گوشی',
          hasBullet: true
        },
      ],
      id: 6,
      descriptionHeight: 250
    },
  ];

  constructor(
    private layout: LayoutService
  ) {
  }

  ngOnInit(): void {
    this.layout.screenSizeChanged.subscribe(res => {
      if (res === ScreenSizeEnum.LG) {
        this.expansionData[2].descriptionHeight = 170;
        this.expansionData[4].descriptionHeight = 280;
        this.expansionData[5].descriptionHeight = 250;
      } else if (res === ScreenSizeEnum.SM) {
        this.expansionData[4].descriptionHeight = 330;
        this.expansionData[5].descriptionHeight = 300;
      } else if (res === ScreenSizeEnum.XS) {
        this.expansionData[2].descriptionHeight = 300;
        this.expansionData[4].descriptionHeight = 450;
        this.expansionData[5].descriptionHeight = 340;
      }
    });
  }
}
