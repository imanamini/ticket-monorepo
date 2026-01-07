import { takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RssFeedService } from '../../services/rss-feed.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { RssFeed } from '../../../../data-access/models/rss-feed.model';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { NewsNoFeedComponent } from '../../components/news-no-feed/news-no-feed.component';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  imports: [CommonModule, NewsCardComponent, NewsNoFeedComponent, NgxAppBarComponent, SpinnerComponent],
  standalone: true,
})
export class NewsComponent extends BaseComponent implements OnInit {
  feeds = signal<RssFeed[]>([]);
  isLoading = signal<boolean>(true);

  private rssFeedService = inject(RssFeedService);
  private navigationService = inject(WealthNavigationService);
  private eventService = inject(NgxEventTrackerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.eventService.sendEvent({ eventName: EIntrackEventName.NEWS_PAGE_VIEW, eventData: {} });
    this.loadFeed();
  }

  loadFeed() {
    this.rssFeedService
      .getFeed()
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res?.success) {
          this.feeds.set(res.result);
        }
        this.isLoading.set(false);
      });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
