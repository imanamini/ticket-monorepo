import { afterNextRender, AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { BlogClient } from '../../../../api/clients/blog-client';
import { BlogCategory, BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { DownloadLinkClient } from '../../../../api/clients/download-link-client';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { SwiperOptions } from 'swiper/types';
import { SeoService } from '../../../services/seo.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { isPlatformBrowser, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiBlogMobilePostCardComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-mobile-post-card/ui-blog-mobile-post-card.component';
import { UiBlogHorizontalPostCardComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-horizontal-post-card/ui-blog-horizontal-post-card.component';
import { DownloadAppLinkDirective } from '../../../../ui/ui-directive/download-app-link.directive';
import { UiBlogPostsPreviewComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-posts-preview/ui-blog-posts-preview.component';
import { UiBlogChildrenSwiperComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-children-swiper/ui-blog-children-swiper.component';
import { UiBlogTopPostsComponent } from '../../../../ui/ui-components/ui-blog/ui-blog-top-posts/ui-blog-top-posts.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-blog-main',
  templateUrl: './blog-main.component.html',
  styleUrls: ['./blog-main.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    UiButtonComponent,
    NgOptimizedImage,
    UiBlogTopPostsComponent,
    UiBlogChildrenSwiperComponent,
    NgFor,
    NgIf,
    UiBlogPostsPreviewComponent,
    DownloadAppLinkDirective,
    NgClass,
    UiBlogHorizontalPostCardComponent,
    UiBlogMobilePostCardComponent,
    SwiperDirective,
  ],
})
export class BlogMainComponent implements OnInit, AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  loaded = false;

  recentPosts: BlogPostCard[];
  categories: BlogCategory[];
  swiperOptions: BlogCategory[];
  priorities: any;
  sections: any;
  recommendedPosts!: BlogPostCard[];
  downloadApp: DownloadSectionData | undefined = undefined;
  selectedTab: number | null = null;

  config: SwiperOptions = {
    slideToClickedSlide: true,
    freeMode: true,
    spaceBetween: 40,
    slidesPerView: 'auto',
    breakpoints: {
      1280: {
        centeredSlides: false,
      },
    },
  };

  isBrowser: boolean;

  constructor(
    private client: BlogClient,
    private deviceService: DeviceService,
    private downloadLinkClient: DownloadLinkClient,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.getData();
  }

  onSelectRecommendationCategory(category: BlogCategory) {
    this.selectedTab = this.categories.indexOf(category);
    this.recommendedPosts = this.sections[category.id]['recommendedPosts'];
  }

  hasRecommendationPost(category: BlogCategory): boolean {
    return this.sections[category.id]['recommendedPosts'].length;
  }

  preparePostsForPreview(posts: BlogPostCard[], type: string) {
    switch (type) {
      case 'SINGLE-SQUARE-DETAILED-COLLECTION':
        return posts.slice(0, 4);
      case 'HORIZONTAL-CARDS-COLLECTION':
        return posts.slice(0, 4);
      case 'VERTICAL-CARDS-COLLECTION':
        return posts.slice(0, 3);
      case 'ACADEMY':
        return posts.slice(0, 3);
    }
  }

  private getData() {
    this.client.getBlogMainPage().subscribe((res) => {
      this.recentPosts = res.recentPosts;
      this.categories = res.categories;
      this.swiperOptions = res.swiperOptions;
      this.sections = res.sections;
      this.priorities = Object.keys(res.sections);
      this.categories.forEach((category, index) => {
        if (res.sections[this.categories[index].id]['recommendedPosts'].length && this.selectedTab === null) {
          this.selectedTab = index;
          this.recommendedPosts = res.sections[this.categories[index].id]['recommendedPosts'];
        }
      });

      this.seo.setPageTitle('مجله اینترنتی دیجی‌پی');
      this.seo.setCanonical('https://www.mydigipay.com/mag/');
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }

  ngAfterViewInit() {
    afterNextRender(() => {
      this.swiper.nativeElement.swiper.activeIndex = this.index;
    });
  }
}
