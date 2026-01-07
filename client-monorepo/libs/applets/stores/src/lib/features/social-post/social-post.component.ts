import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  InstagramMediaTypes,
  SocialApiService,
  SocialPost,
  SocialSearchPostConfig,
  SocialSlide,
  SocialStoreEventPrefix,
} from '@client-monorepo/social';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { getJalaliDay, getJalaliMonthTitle, getJalaliYear } from '@client-monorepo/common/utilities';
import { VideoPlayerComponent } from '@client-monorepo/common/ui-components';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { SocialCtaComponent } from '../../components/social-cta/social-cta.component';
import { SocialCtaConfigModel } from '../../data-access/models/social-cta-config.model';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { SocialService } from '@client-monorepo/social';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'stores-applet-social-post',
  standalone: true,
  imports: [
    CommonModule,
    NgxAppBarComponent,
    ApiImageModule,
    VideoPlayerComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    NgxBadgeModule,
    NgxIcon,
    NgxSkeletonLoadingComponent,
    SocialCtaComponent,
  ],
  templateUrl: './social-post.component.html',
  styleUrl: './social-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialPostComponent implements OnInit, OnDestroy {
  // Injections
  activatedRoute = inject(ActivatedRoute);
  socialApi = inject(SocialApiService);
  backHandler = inject(BackHandlerService);
  actionHandler = inject(ActionHandlerService);
  bottomNavService = inject(NgxBottomNavigationService);
  socialService = inject(SocialService);
  meta = inject(Meta);

  // Variables
  postDescription = viewChild<ElementRef<HTMLDivElement>>('postDescription');
  protected readonly InstagramMediaTypes = InstagramMediaTypes;
  postId = signal<string>('');
  loading = signal(false);
  post = signal<SocialPost | undefined>(undefined);
  jalaliDate = computed(() => {
    const date = this.post()?.modificationDate;
    let day = '1';
    let month = 'فروردین';
    let year = '1400';
    if (date) {
      day = getJalaliDay(date);
      month = getJalaliMonthTitle(date);
      year = getJalaliYear(date);
    }
    return [day, month, year].join(' ');
  });
  likeBadgeText = computed(() => (this.post()?.likeCount ?? '') + ' کاربر پسندیدند');
  slides = computed<SocialSlide[]>(() => {
    const slideUrls = this.post()?.downloadableSlideUrls ?? [];
    const computedSlides: SocialSlide[] = [];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    for (const slideUrl of slideUrls) {
      if (this.hasExtension(slideUrl, imageExtensions)) {
        computedSlides.push({ url: slideUrl, type: 'image' });
      } else if (this.hasExtension(slideUrl, videoExtensions)) {
        computedSlides.push({ url: slideUrl, type: 'video' });
      }
    }
    return computedSlides;
  });
  showLikeBadge = computed(() => {
    if (this.post()?.mediaType === InstagramMediaTypes.SLIDE) {
      return this.slides()?.length && this.slides()[this.carouselActiveIndex()]?.type !== 'video';
    } else {
      return true;
    }
  });
  carouselActiveIndex = signal(0);
  ctaConfig = computed<SocialCtaConfigModel>(() => {
    const post = this.post();
    return {
      instagramUrl: post?.url,
      whatsappNumber: post?.storeWhatsAppCellphone,
      storeTrackingCode: post?.storeTrackingCode,
      postId: this.postId(),
      referrer: 'POST',
    };
  });
  showCta = signal(false);
  private observer?: IntersectionObserver;

  constructor() {
    effect(
      () => {
        if (this.postId() && this.postId() !== '') {
          this.getPost();
        }
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        if (this.postDescription()) {
          this.startObservation();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.bottomNavService.hide();
    this.getPostId();
  }

  startObservation(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.showCta.set(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      },
    );
    this.observer.observe(this.postDescription()!.nativeElement);
  }

  getPostId(): void {
    this.postId.set(decodeURI(this.activatedRoute.snapshot.paramMap.get('postId') as string));
  }

  getPost(): void {
    this.loading.set(true);
    const config: SocialSearchPostConfig = {
      page: 0,
      size: 10,
      postId: this.postId(),
      project: 'POST_STORE_FULL',
    };
    this.socialApi.searchPosts(config).subscribe({
      next: (res) => {
        this.post.set(res.posts[0]);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  hasExtension(url: string, extensions: string[]): boolean {
    try {
      const parsed = new URL(url); // ensure valid URL
      const pathname = parsed.pathname.toLowerCase();
      return extensions.some((ext) => pathname.endsWith('.' + ext));
    } catch {
      return false; // not a valid URL
    }
  }

  goToProfile(): void {
    const trackingCode = this.post()?.storeTrackingCode;
    if (!trackingCode) return;
    this.socialService.sendClickEvent(SocialStoreEventPrefix + trackingCode);
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: { url: 'stores/social/store/' + trackingCode },
    });
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy(): void {
    this.bottomNavService.show();
    this.observer?.disconnect();
  }
}
