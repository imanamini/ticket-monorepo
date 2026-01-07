import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxIcon} from '@digipay/ngx-icon';
import {headerMode} from '../../../ui/models/headerMode-type.model';
import {navItemModel} from './model/header.model';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {MenuService} from '../menu.service';

@Component({
  selector: 'app-new-header',
  standalone: true,
  imports: [CommonModule, NgxIcon, RouterLink],
  templateUrl: './new-header.component.html',
  styleUrl: './new-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewHeaderComponent implements OnInit {
  appUrl = environment.appUrl;
  headerMode: WritableSignal<headerMode> = signal('home');
  menuOpen = false;

  menus = [
    {
      title: 'وام و اعتبار',
      isActive: false,
      subMenu: [
        {
          title: 'وام خرید کالا',
          isActive: false,
          icon: 'credit',
          link: '/credit/c-credit/',
          hasHref: false,
          useImg: false,
        },
        {
          title: 'الان بخر بعدا پرداخت کن',
          isActive: false,
          icon: 'bnpl',
          link: '/bnpl/c-bnpl/',
          hasHref: false,
          useImg: false,
        },
        // {
        //   title: 'خرید اقساطی با چک',
        //   isActive: false,
        //   icon: '/assets/images/header/installment.svg',
        //   iconActive: '/assets/images/header/installment-active.svg',
        //   link: '/credit/installment-sale',
        //   hasHref: false,
        //   useImg: true,
        // },
        {
          title: 'خرید اقساطی از دیجی‌کالا',
          isActive: false,
          icon: '/assets/images/header/digikala.svg',
          iconActive: '/assets/images/header/digikala-active.svg',
          link: '/credit/merchants/digikala/',
          hasHref: false,
          useImg: true,
        },
      ],
    },
    {
      title: 'بیمه',
      isActive: false,
      subMenu: [
        {
          title: 'بیمه شخص ثالث',
          isActive: false,
          icon: 'car',
          hasHref: true,
          link: `/insurtech/third-party-insurance/`,
          useImg: false,
        },
        {
          title: 'بیمه تجهیزات الکترونیک',
          isActive: false,
          icon: 'digital-device',
          hasHref: false,
          link: '/insurtech/equipment/',
          useImg: false,
        }
      ],
    },
    {
      title: 'مدیریت سرمایه',
      isActive: false,
      link: '/wealth/',
      hasHref: false,
    },
    {
      title: 'خدمات کسب و کارها',
      isActive: false,
      subMenu: [
        {
          title: 'درگاه پرداخت اعتباری',
          isActive: false,
          icon: 'bank',
          link: '/bpg/',
          hasHref: false,
          useImg: false,
        },
        {
          title: 'وام فروشندگان',
          isActive: false,
          icon: 'credit',
          link: '/merchants-seller/',
          hasHref: false,
          useImg: false,
        },
        {
          title: 'درگاه پرداخت جامع',
          isActive: false,
          icon: 'bank',
          link: '/ipg/',
          hasHref: false,
          useImg: false,
        },
        {
          title: 'تسویه زودهنگام',
          isActive: false,
          icon: 'cash-out',
          link: '/merchant-credit/',
          hasHref: false,
          useImg: false,
        },
      ],
    },
    {
      title: 'خدمات سازمانی',
      isActive: false,
      subMenu: [
        {
          title: 'خرید اقساطی از دیجی‌کالا',
          isActive: false,
          icon: '/assets/images/header/digikala.svg',
          iconActive: '/assets/images/header/digikala-active.svg',
          link: '/credit/o-credit/',
          hasHref: false,
          useImg: true,
        },
        {
          title: 'الان بخر بعدا پرداخت کن',
          isActive: false,
          icon: 'bnpl',
          link: '/credit/orgbnpl/',
          hasHref: false,
          useImg: false,
        },
        // {
        //   title: 'کارت اعتباری',
        //   isActive: false,
        //   icon: 'credit',
        //   hasHref: false,
        //   useImg: false,
        //   subMenu: [
        //     {
        //       title: 'کارت زندگی',
        //       isActive: false,
        //       icon: '/assets/images/header/zendegi-card.svg',
        //       iconActive: '/assets/images/header/zendegi-card-active.svg',
        //       link: '/credit/zendegi-card/',
        //       hasHref: false,
        //       useImg: true,
        //     },
        //     {
        //       title: 'آسان خرید',
        //       isActive: false,
        //       icon: '/assets/images/header/asan-kharid.svg',
        //       iconActive: '/assets/images/header/asan-kharid-active.svg',
        //       link: '/credit/asankharid/',
        //       hasHref: false,
        //       useImg: true,
        //     },
        //     {
        //       title: 'کارت خرید ملت',
        //       isActive: false,
        //       icon: '/assets/images/header/mellat-card.svg',
        //       iconActive: '/assets/images/header/mellat-card-active.svg',
        //       hasHref: false,
        //       link: '/credit/shop-card/',
        //       useImg: true,
        //     },
        //     {
        //       title: ' کارت خرید ملی',
        //       isActive: false,
        //       icon: '/assets/images/header/melli-card.svg',
        //       iconActive: '/assets/images/header/melli-card-active.svg',
        //       link: '/credit/bmicc/',
        //       hasHref: false,
        //       useImg: true,
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'درباره دیجی پی',
    //   isActive: false,
    //   subMenu: [
    //     {
    //       title: 'گزارش سالانه',
    //       isActive: false,
    //       icon: 'compound',
    //       useImg: false,
    //       subMenu: [
    //         {
    //           title: 'گزارش سال ۱۴۰۲',
    //           isActive: false,
    //           link: '/report-1402',
    //           hasHref: false,
    //         },
    //         {
    //           title: 'گزارش سال۱۴۰۱',
    //           isActive: false,
    //           link: '/report-1401',
    //           hasHref: false,
    //         },
    //         {
    //           title: 'گزارش سال ۱۴۰۰',
    //           isActive: false,
    //           hasHref: false,
    //           link: '/landing/report-2021',
    //         },
    //         {
    //           title: 'گزارش سال ۱۳۹۹',
    //           isActive: false,
    //           link: '/landing/report-2020',
    //           hasHref: false,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'فرصت‌های شغلی',
    //       isActive: false,
    //       icon: 'bag-2',
    //       link: '/careers',
    //       hasHref: false,
    //       useImg: false,
    //     },
    //     {
    //       title: 'مجله دیجی‌پی',
    //       isActive: false,
    //       icon: '/assets/images/header/book.svg',
    //       iconActive: '/assets/images/header/book-active.svg',
    //       hasHref: false,
    //       link: '/mag',
    //       useImg: true,
    //     },
    //     {
    //       title: 'مستندات فنی',
    //       isActive: false,
    //       icon: 'attached-file',
    //       hasHref: false,
    //       link: '/developers/docs/upg',
    //       useImg: false,
    //     },
    //     {
    //       title: 'درباره دیجی‌پی',
    //       isActive: false,
    //       icon: '/assets/images/header/digipay-sign.svg',
    //       iconActive: '/assets/images/header/digipay-sign-active.svg',
    //       hasHref: false,
    //       link: '/about',
    //       useImg: true,
    //     },
    //   ],
    // },
  ];

  navItems: Partial<navItemModel>[] = [
    {
      title: 'خانه',
      icon: 'home',
      isActive: false,
      symbol: 'home',
      link: '/',
      hasHref: true,
      showBadge: false
    },
    {
      title: 'خدمات',
      icon: 'more',
      isActive: false,
      symbol: 'services',
      link: '/hub/',
      hasHref: true,
      showBadge: false
      // subMenu: ['پرداخت', 'وام و اعتبار', 'خدمات موبایل', 'خودرو'],
    },
    {
      title: 'فروشگاه‌ها',
      icon: 'bag',
      isActive: false,
      symbol: 'stores',
      link: '/stores/',
      hasHref: true,
      showBadge: true
      // subMenu: ['دسته‌بندی‌ها', 'شگفت‌انگیزها']
    },
    {
      title: 'پرداخت',
      icon: 'card-to-card',
      isActive: false,
      symbol: 'payment',
      link: `${this.appUrl}/transactions/`,
      hasHref: true,
      showBadge: false
    },
  ];

  stickyHeader;

  isSubmenuHovered = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private menuService: MenuService,
  ) {
    effect(() => {
      // this.activeNavItem();
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const nav = this.el.nativeElement.querySelector('nav');
    const header = this.el.nativeElement.querySelector('.header');

    if (window.innerWidth > 768) {
      if (currentScroll >= 100) {
        this.renderer.setStyle(this.stickyHeader, 'visibility', 'visible');
        this.renderer.setStyle(this.stickyHeader, 'opacity', '1');
        this.renderer.setStyle(nav, 'visibility', 'hidden');
        this.renderer.setStyle(nav, 'opacity', '0');
        this.renderer.setStyle(header, 'visibility', 'hidden');
        this.renderer.setStyle(header, 'opacity', '0');
      } else {
        this.renderer.setStyle(this.stickyHeader, 'visibility', 'hidden');
        this.renderer.setStyle(this.stickyHeader, 'opacity', '0');
        this.renderer.setStyle(nav, 'visibility', 'visible');
        this.renderer.setStyle(nav, 'opacity', '1');
        this.renderer.setStyle(header, 'visibility', 'visible');
        this.renderer.setStyle(header, 'opacity', '1');
      }
    } else {
      this.renderer.setStyle(this.stickyHeader, 'visibility', 'hidden');
      this.renderer.setStyle(this.stickyHeader, 'opacity', '0');
      this.renderer.setStyle(nav, 'visibility', 'visible');
      this.renderer.setStyle(nav, 'opacity', '1');
      this.renderer.setStyle(header, 'visibility', 'visible');
      this.renderer.setStyle(header, 'opacity', '1');
    }
  }

  ngOnInit(): void {
    this.stickyHeader = this.el.nativeElement.querySelector('.header-sticky');
    this.renderer.setStyle(this.stickyHeader, 'visibility', 'hidden');
    this.renderer.setStyle(this.stickyHeader, 'opacity', '0');

    // this.activeNavItem();
  }

  activeNavItem() {
    this.navItems.forEach((item) => {
      item.isActive = item.symbol === this.headerMode();
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuService.toggleMenu();
  }

  activeMainMenu(menu: any) {
    menu.isActive = !menu.isActive;
    this.menus.forEach((item) => {
      if (item !== menu) {
        item.isActive = false;
      }
    });
  }

  activeSubmenu(submenu) {
    event.stopPropagation();
    submenu.isActive = !submenu.isActive;
    this.menus.forEach((item) => {
      if (item.subMenu) {
        item.subMenu.forEach((subMenuItem) => {
          if (subMenuItem !== submenu) {
            subMenuItem.isActive = false;
          }
        });
      }
    });
  }

  setActiveSubmenu(submenu: any, status: boolean) {
    if (window.innerWidth > 768) {
      submenu.isActive = status;
    }
    if (status && submenu.subMenu) {
      this.isSubmenuHovered = true;
      const dividers = this.el.nativeElement.querySelectorAll('.custom-divider');
      dividers.forEach((divider: HTMLElement) => {
        this.renderer.setStyle(divider, 'display', 'block');
      });
    } else {
      this.isSubmenuHovered = false;
      const dividers = this.el.nativeElement.querySelectorAll('.custom-divider');
      dividers.forEach((divider: HTMLElement) => {
        this.renderer.setStyle(divider, 'display', 'none');
      });
    }
  }

  setActiveSubsubmenu(subsubmenu: any, status: boolean) {
    if (window.innerWidth > 768) {
      subsubmenu.isActive = status;
    }
  }

  setActiveMenu(selectedItem: any): void {
    this.headerMode.set(selectedItem.symbol);
  }
}
