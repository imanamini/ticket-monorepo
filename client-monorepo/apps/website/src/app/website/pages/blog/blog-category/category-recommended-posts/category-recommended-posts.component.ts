import { AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { BlogPostCard } from '../../../../../api/clients/models/content/blog-post';
import { SwiperOptions } from 'swiper/types';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiPostCardComponent } from '../../../../../ui/ui-components/ui-post-card/ui-post-card/ui-post-card.component';
import { UiBlogVerticalPostCardComponent } from '../../../../../ui/ui-components/ui-blog/ui-blog-vertical-post-card/ui-blog-vertical-post-card.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-category-recommended-posts',
  templateUrl: './category-recommended-posts.component.html',
  styleUrls: ['./category-recommended-posts.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiBlogVerticalPostCardComponent, UiIconDirective, UiPostCardComponent, SwiperDirective, NgxIcon],
})
export class CategoryRecommendedPostsComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;
  @Input() posts: BlogPostCard[];
  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    slidesOffsetAfter: 80,
    loop: false,
    slideToClickedSlide: true,
    slidesPerView: 3.7,
    width: 1370,
    spaceBetween: 24,
  };

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  goToBlogPost(post: BlogPostCard) {
    window.open('/mag/' + post.category.slug + '/' + post.slug + '/', '_blank');
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }
}
