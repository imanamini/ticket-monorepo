import { Component, output, signal } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';

@Component({
  selector: 'app-news-no-feed',
  templateUrl: './news-no-feed.component.html',
  styleUrls: ['./news-no-feed.component.scss'],
  imports: [NgxButtonComponent, NgxCountDownComponent],
  standalone: true,
})
export class NewsNoFeedComponent {
  onRetry = output();
  inProgress = signal<boolean>(false);

  refetchNews() {
    if (!this.inProgress()) {
      this.onRetry.emit();
      this.inProgress.set(true);
    }
  }
}
