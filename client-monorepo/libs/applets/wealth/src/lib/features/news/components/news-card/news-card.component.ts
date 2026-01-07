import { Component, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { RssFeed } from '../../../../data-access/models/rss-feed.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  imports: [PipesModule, NgxIcon],
  standalone: true,
})
export class NewsCardComponent {
  data = input<RssFeed>();

  onShowMore(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    window.open(this.data().link);
  }
}
