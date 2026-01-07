import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  signal,
  ViewChildren,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlackFridayIntroComponent } from './intro-section/blackFridayIntro.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PageDataService } from '../../../services/page-data.service';
import { blackFridayTemplateData } from '../../../../api/clients/models/templates/black-friday/black-friday-template-data';
import { BlackFridayHotDealsComponent } from './hot-deals/blackFridayHotDeals.component';
import { BlackFridayMerchantsComponent } from './merchants/blackFridayMerchants.component';
import { BlackFridayPromotionComponent } from './promotion/blackFridayPromotion.component';
import { BlackFridayPrizeComponent } from './prize/blackFridayPrize.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { CtaBottomSheetComponent } from '../../../layout/cta-bottom-sheet/cta-bottom-sheet.component';
import { CtaConfig, CtaService } from '../../../layout/cta-bottom-sheet/cta.service';
import { BlackFridayCategoriesProductComponent } from './categoriesProduct/blackFridayCategoriesProduct.component';
import { BnplStepsComponent } from '../landing-onboarding/bnpl-steps/bnpl-steps.component';
import { purchaseSteps } from '../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-black-friday',
  standalone: true,
  imports: [
    CommonModule,
    BlackFridayIntroComponent,
    BlackFridayHotDealsComponent,
    BlackFridayMerchantsComponent,
    BlackFridayPromotionComponent,
    BlackFridayPrizeComponent,
    UiFaqComponent,
    CtaBottomSheetComponent,
    BlackFridayCategoriesProductComponent,
    BnplStepsComponent,
  ],
  templateUrl: './blackFriday.component.html',
  styleUrl: './blackFriday.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class BlackFridayComponent implements OnInit, AfterViewInit, OnDestroy {
  blackFridayTemplate = signal<blackFridayTemplateData | null>(null);
  @ViewChildren('wrap', { read: ElementRef }) wrappers!: QueryList<ElementRef<HTMLElement>>;

  isStickyVisible = false;
  loaded = false;
  isMobileMode = false;

  ctaService = inject(CtaService);
  router = inject(Router);

  private previousThemeColor: string | null = null;

  private rafId = 0;
  private targetScroll = 0;
  private currentPositions: number[] = [];
  private speeds: number[] = [];

  // tuning params
  private ease = 0.12; // lerp smoothing (0.05 - 0.2)
  private maxStep = 80; // limit px change per frame to avoid huge jumps

  private onScrollBound = this.onScroll.bind(this);

  purchaseSteps = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
    @Inject(PLATFORM_ID) private platformId: string,
    private renderer: Renderer2,
  ) {
    this.purchaseSteps.set({
      title: 'نحوه استفاده از کد تخفیف درگاه دیجی‌پی',
      subtitle: '',
      steps: [
        {
          title: '۱. در این قسمت کد تخفیف را یادداشت کنید.',
          description: '',
          image: {
            url: '/assets/images/black-friday/step1.webp',
          },
        },
        {
          title: '۲. پس از طی مراحل خرید، در درگاه خرید دیجی‌پی، دکمه کد تخفیف را از پایین صفحه کلیک کنید.',
          description: '',
          image: {
            url: '/assets/images/black-friday/step2.webp',
          },
        },
        {
          title: '۳. سپس کد تخفیفی که یادداشت کرده‌اید را وارد کرده و از تخفیف استفاده کنید.',
          description: '',
          image: {
            url: '/assets/images/black-friday/step3.webp',
          },
        },
      ],
    });
  }

  readonly cta = this.ctaService.cta;

  private setStatusBarColor(color: string) {
    if (isPlatformBrowser(this.platformId)) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        this.previousThemeColor = meta.getAttribute('content');
        meta.setAttribute('content', color);
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileMode = window.innerWidth <= 1280;
      this.setStatusBarColor('#131313');
      this.renderer.addClass(document.body, 'black-friday-theme');
    }
    this.route.url.subscribe((segments) => {
      this.pageDataService.getPageData('landings', segments[0].path).subscribe((res) => {
        this.blackFridayTemplate.set(res.page.templateData);
        this.loaded = true;
        const currentUrl = this.router.url;
        this.updateCta(currentUrl);
      });
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const hotDeals = document.getElementById('hot-deals');
      const finalCta = document.getElementById('final-cta');

      if (!hotDeals || !finalCta) return;

      const scrollPos = window.scrollY + window.innerHeight / 2; // middle of viewport
      const hotDealsTop = hotDeals.offsetTop + 300;
      const finalCtaTop = finalCta.offsetTop - 300;

      if (scrollPos >= hotDealsTop && scrollPos < finalCtaTop) {
        this.isStickyVisible = true;
      } else {
        this.isStickyVisible = false;
      }
    }
  }

  private removeScrollListener = () => {};

  private onScroll() {
    this.targetScroll = window.scrollY;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollParallax();

      this.route.fragment.subscribe((fragment) => {
        if (fragment === 'voucher-guide') {
          of('')
            .pipe(delay(0))
            .subscribe(() => {
              const el = document.getElementById('black-friday-steps');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
        }
      });
      window.addEventListener('scroll', this.onScrollBound, { passive: true });
    }
  }

  private initScrollParallax(): void {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.absolute-pics .wrap'));
    if (!nodes.length) return;

    this.currentPositions = nodes.map(() => 0);

    // Set speeds and optional custom easing per element
    this.speeds = nodes.map((el) => parseFloat(el.dataset.speedY || '0.15'));

    const defaultEase = 0.03;

    const eases = nodes.map((el) => defaultEase);

    this.targetScroll = window.scrollY;

    const animate = () => {
      const scrollY = this.targetScroll;

      nodes.forEach((el, i) => {
        const target = scrollY * this.speeds[i];
        let delta = target - this.currentPositions[i];
        delta = Math.max(Math.min(delta, this.maxStep), -this.maxStep);

        this.currentPositions[i] += delta * eases[i]; // use per-element ease
        el.style.transform = `translate3d(0, ${this.currentPositions[i]}px, 0)`;
      });

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  private updateCta(url: string) {
    const routeMap: Record<string, CtaConfig> = {
      '/landings/black-friday/': {
        icon: 'bnpl',
        iconSize: '24px',
        text: 'اعتبار دیجی‌پی',
        link: this.blackFridayTemplate().introSection.primaryCta.link ?? '',
        ctaTitle: 'دریافت اعتبار اقساطی',
        textStyles: 'c-2 text-oninvert-high',
        iconType: 'bold',
      },
    };

    const match = Object.entries(routeMap).find((entry) => {
      const path = entry[0];
      return url.startsWith(path);
    });

    this.ctaService.setCta(match ? match[1] : null);
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    this.setStatusBarColor(this.previousThemeColor);
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(document.body, 'black-friday-theme');
    }
  }
}
