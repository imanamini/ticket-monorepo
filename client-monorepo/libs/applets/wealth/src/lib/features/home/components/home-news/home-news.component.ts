import { Component, inject, signal } from '@angular/core';
import { FAQ, News, PRICES, SEJAM_CHECK_ROUTE } from '../../../../data-access/constants/app-routes';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wealth-applet-home-news',
  standalone: true,

  templateUrl: './home-news.component.html',
  styleUrl: './home-news.component.scss',
  imports: [CommonModule],
})
export class HomeNewsComponent {
  buttons = signal<IButtons[]>([
    {
      title: 'بررسی سجام',
      icon: 'wealth-assets/svg/sejam-check.svg',
      route: SEJAM_CHECK_ROUTE,
      id: 'SEJAM',
    },
    {
      title: 'قیمت بازارها',
      icon: 'wealth-assets/svg/chart-button.svg',
      route: PRICES,
      id: 'PRICE',
    },
    {
      title: 'سوالات متداول',
      icon: 'wealth-assets/svg/faq-button.svg',
      route: FAQ,
      id: 'FAQ',
    },
    {
      title: 'اخبار اقتصادی',
      icon: 'wealth-assets/svg/news-button.svg',
      route: News,
      id: 'NEWS',
    },
  ]);

  private navigationService = inject(WealthNavigationService);
  private eventService = inject(NgxEventTrackerService);

  goTo(route: string) {
    if (route === News) {
      this.eventService.sendEvent({ eventName: EIntrackEventName.NEWS_SELECT, eventData: {} });
    } else if (route === FAQ) {
      this.eventService.sendEvent({ eventName: EIntrackEventName.FAQ_SELECT, eventData: {} });
    }
    this.navigationService.navigate([route]);
  }
}

// TODO: Check all button interfaces and use just one
interface IButtons {
  title: string;
  icon: string;
  route: string;
  id: string;
}
