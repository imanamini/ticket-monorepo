import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ScreenSizeEnum } from '../../../../../../enums/screen-size.enum';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../../../../../data-access/services/layout.service';
import { UnbundledService } from '../../services/unbundled.service';

@Component({
  selector: 'app-about-service',
  templateUrl: './about-service.component.html',
  styleUrls: ['./about-service.component.scss'],
  imports: [
    NgForOf
  ],
  standalone: true
})
export class AboutServiceComponent implements OnInit, OnDestroy {

  size: ScreenSizeEnum;

  items = [
    {
      iconName: 'broke',
      title: 'شکستگی',
      description: 'آسیب‌دیدگی‌ها و صدمه‌ها هم جبران‌پذیرند. با بیمه کردن گوشی تلفن، اضطراب دیگر معنا ندارد'
    },
    {
      iconName: 'water',
      title: 'آب‌زدگی',
      description: 'هر نوع آبدیدگي، نم زدگي، زنگ زدگي و رسوب زدگي ناشي از آنها در صورتي که منجر به از کار افتادن دستگاه بیمه شده شود؛'
    },
    {
      iconName: 'fire',
      title: 'سوختگی',
      description: 'بیمه موبایل دارایی شما را برابر آسیب‌های ناشی از سوختگی (آتش‌سوزی) محافظت می‌کند'
    },
  ];

  cardItems = [
    {
      iconName: 'mobile-tap',
      faTitle: 'کاملا آنلاین'
    },
    {
      iconName: 'umbrella',
      faTitle: 'حداکثر پوشش بیمه ای'
    },
    {
      iconName: 'ticket',
      faTitle: 'محاسبه بر اساس قیمت'
    }
  ];

  subscriptions: Subscription[] = [];

  constructor(
    private layoutService: LayoutService,
    private unbundledService: UnbundledService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions[0] = this.layoutService.screenSizeChanged.subscribe(res => {
      this.size = res;
    });

    this.subscriptions[1] = this.unbundledService.lead.asObservable().subscribe(lead => {
        if (lead) {
          if (lead.coverages.length > 0) {
            if (lead.coverages.indexOf('FullCoverageStealing') >= 0) {
              this.setStealingText('انواع سرقت', 'بیمه سرقت موبایل و سایر لوازم الکترونیکی انواع سرقت‌های خیابانی اعم از کیف قاپی، دست قاپی و... را  جبران می‌کند.');
            }
            if (lead.coverages.indexOf('Stealing') >= 0) {
              this.setStealingText('سرقت با شکسست حرز', 'بیمه سرقت موبایل جبران خسارت ناشی از دزدی گوشی را تضمین می‌کند');
            }
          } else {
            // TODO: there is a bug in back-end API which makes this array empty but it means FullCoverageStealing
            this.setStealingText('انواع سرقت', 'بیمه سرقت موبایل و سایر لوازم الکترونیکی انواع سرقت‌های خیابانی اعم از کیف قاپی، دست قاپی و... را  جبران می‌کند.');
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  private setStealingText(title: string, description: string): void {
    this.items.push({
      iconName: 'steel',
      title,
      description,
    });
  }
}
