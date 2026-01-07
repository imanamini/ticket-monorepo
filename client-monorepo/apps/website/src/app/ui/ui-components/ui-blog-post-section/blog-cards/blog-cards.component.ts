import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { Category } from '../../../../api/clients/models/content/category';
import { BlogClient } from '../../../../api/clients/blog-client';
import { CarouselConfig } from '../../ui-carousel/ui-carousel/carousel-config';
import { UiBlogPostCardComponent } from '../../ui-blog/ui-blog-post-card/ui-blog-post-card.component';
import { UiCarouselComponent } from '../../ui-carousel/ui-carousel/ui-carousel.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-blog-cards',
  templateUrl: './blog-cards.component.html',
  styleUrls: ['./blog-cards.component.scss'],
  standalone: true,
  imports: [NgIf, UiCarouselComponent, NgClass, UiBlogPostCardComponent],
})
export class BlogCardsComponent implements OnInit, AfterViewInit {
  @Input()
  title: string | undefined;

  @Input()
  showBlog = false;

  @Input()
  subtitle: string | undefined;

  @Input()
  blogPosts!: BlogPost[];

  @Input()
  categories!: Category[];

  activeIndex = -1;

  config: CarouselConfig;

  configCategories: CarouselConfig;

  constructor(
    private client: BlogClient,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.config = {
      slidesPerView: 1,
      loop: true,
      hasNavigation: true,
      hasCustomPagination: false,
      pullDrag: true,
      breakpoints: {
        1200: {
          slidesPerView: 2,
          gap: 60,
        },
        744: {
          gap: 30,
        },
        280: {
          slidesPerView: 1.1,
          gap: 15,
        },
      },
    };

    this.configCategories = {
      rtl: true,
      hasCustomPagination: false,
      autoWidth: true,
      gap: 10,
      hasNavigation: true,
      breakpoints: {
        1100: {
          slidesPerView: 6,
        },
        650: {
          slidesPerView: 4,
        },
        455: {
          slidesPerView: 2,
        },
        330: {
          slidesPerView: 1.2,
        },
      },
    };
  }

  getCategories(slug: string) {
    this.client.getPostByCategorySlug(slug, 10).subscribe((res) => {
      this.blogPosts = res.items;
      this.changeDetector.detectChanges();
    });
  }

  changeTab(index: number) {
    this.activeIndex = index;
    if (this?.categories && this.categories.length) {
      this.getCategories(this.categories[index].slug);
    }
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {
    this.changeTab(0);
  }
}
