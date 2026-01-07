import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { CareersService } from '../careers.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { JobCategory } from '../../../../api/clients/models/hr/job-category';
import { JobPostItem } from '../../../../api/clients/models/hr/job-post-item';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SwiperContainer } from 'swiper/swiper-element';
import { JobCardComponent } from './job-card/job-card.component';
import { UiSpinnerComponent } from '../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';

@Component({
  selector: 'app-careers-job-browser',
  templateUrl: './careers-job-browser.component.html',
  styleUrls: ['./careers-job-browser.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiSpinnerComponent, JobCardComponent, SwiperDirective],
})
export class CareersJobBrowserComponent implements OnInit, OnDestroy {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  categories: JobCategory[] = [];

  selectedCategory: JobCategory = null;

  jobPosts: JobPostItem[] = [];

  page = 1;

  perPage = 100;

  totalPages = 1;

  loadingJobs = false;

  activeIndex = -1;

  owlOptions: OwlOptions = {
    loop: true,
    items: 8,
    mouseDrag: true,
    touchDrag: true,
    rtl: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoWidth: true,
    margin: 16,
    nav: false,
  };

  configCategories: SwiperOptions = {
    slideToClickedSlide: true,
    centeredSlides: true,
    freeMode: true,
    slidesPerView: 10,
    spaceBetween: 12,
    navigation: false,
    breakpoints: {
      '1280': {
        centeredSlides: false,
      },
    },
  };

  destroyed = new ReplaySubject(1);

  constructor(
    private service: CareersService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.service.jobCategories
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((categories) => {
        this.categories = categories;
      });

    this.service.selectedCategory
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((category) => {
        this.selectedCategory = category;
      });

    this.service.jobPosts
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((jobPosts) => {
        this.jobPosts = jobPosts;
      });

    this.service.currentPage
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((page) => {
        this.page = page;
      });

    this.service.perPage
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((perPage) => {
        this.perPage = perPage;
      });

    this.service.totalPages
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((totalPages) => {
        this.totalPages = totalPages;
      });

    this.service.loadingJobs
      .asObservable()
      .pipe(takeUntil(this.destroyed))
      .subscribe((loadingJobs) => {
        this.loadingJobs = loadingJobs;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  onCategorySelect(category: JobCategory): void {
    this.service.selectedCategory.next(category);
  }

  changeTab(index: number) {
    this.activeIndex = index;
    this.changeDetector.detectChanges();
  }
}
