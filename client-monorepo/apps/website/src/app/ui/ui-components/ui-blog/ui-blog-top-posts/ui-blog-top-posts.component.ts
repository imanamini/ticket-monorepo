import { AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { BlogPostCard } from '../../../../api/clients/models/content/blog-post';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { PostCardShortenerPipe } from '../../../ui-pipes/post-card-shortener.pipe';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';


@Component({
  selector: 'app-ui-blog-top-posts',
  templateUrl: './ui-blog-top-posts.component.html',
  styleUrls: ['./ui-blog-top-posts.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, PostCardShortenerPipe, SwiperDirective],
})
export class UiBlogTopPostsComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input() count = 7;

  @Input() posts: BlogPostCard[];

  isBrowser: boolean;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: false,
    slidesOffsetAfter: 40,
    slideToClickedSlide: true,
    slidesPerView: 1.4,
    spaceBetween: 16,
    breakpoints: {
      1050: {
        slidesPerView: 2.8,
        spaceBetween: 16,
      },
      900: {
        slidesPerView: 2.4,
        spaceBetween: 16,
      },
      744: {
        slidesPerView: 2.2,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 1.8,
        spaceBetween: 16,
      },
    },
  };

  mainPost: BlogPostCard;
  restPosts: BlogPostCard[];
  topSectionPosts: BlogPostCard[];

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.posts && changes.posts.currentValue) {
      this.topSectionPosts = this.posts;
      this.mainPost = this.posts[0];
      this.restPosts = this.posts.slice(1, 7);
    }
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
