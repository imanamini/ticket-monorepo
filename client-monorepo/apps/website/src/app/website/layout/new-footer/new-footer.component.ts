import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2, signal
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NgxIcon} from '@digipay/ngx-icon';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {NgxButtonComponent} from '@digipay/ngx-button';

@Component({
  selector: 'app-new-footer',
  standalone: true,
  imports: [CommonModule, NgxIcon, RouterLink, NgxButtonComponent],
  templateUrl: './new-footer.component.html',
  styleUrl: './new-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFooterComponent implements OnInit, AfterViewInit {
  appUrl = environment.appUrl;
  collapsibleState = {
    about: false,
    services: false,
    customers: false,
  };

  shortText = `    <p><span style="font-weight: 400;">دیجی&zwnj;پی یک پلتفرم جامع در حوزه خدمات مالی و پرداخت الکترونیک است که با ارائه راهکارهای متنوع، مدیریت مالی را برای کاربران آسان&zwnj;تر و هوشمندتر می&zwnj;کند. از پرداخت&zwnj;های روزمره گرفته تا </span><a href="/credit/c-credit/"><span style="font-weight: 400;">خرید اقساطی</span></a><span style="font-weight: 400;">، مدیریت ثروت و بیمه، همه و همه در دیجی&zwnj;پی یکجا در دسترس شما هستند.</span></p>
`;

  fullText = `<p><span style="font-weight: 400;">دیجی&zwnj;پی یک پلتفرم جامع در حوزه خدمات مالی و پرداخت الکترونیک است که با ارائه راهکارهای متنوع، مدیریت مالی را برای کاربران آسان&zwnj;تر و هوشمندتر می&zwnj;کند. از پرداخت&zwnj;های روزمره گرفته تا </span><a href="https://www.mydigipay.com/credit/c-credit/"><span style="font-weight: 400;">خرید اقساطی</span></a><span style="font-weight: 400;">، مدیریت ثروت و بیمه، همه و همه در دیجی&zwnj;پی یکجا در دسترس شما هستند.</span></p>
<p><strong>پرداخت اعتباری؛ خرید راحت بدون دغدغه مالی</strong></p>
<p><span style="font-weight: 400;">با سرویس&zwnj;های اعتبار خرد و </span><a href="https://www.mydigipay.com/credit/c-credit/"><span style="font-weight: 400;">خرید اعتباری</span></a><span style="font-weight: 400;"> دیجی&zwnj;پی، بدون نیاز به ضامن و چک، می&zwnj;توانید کالاها و خدمات مورد نیاز خود را خریداری کنید و هزینه را به&zwnj;صورت اقساطی بپردازید. این سرویس امکان برنامه&zwnj;ریزی مالی بهتر را برای کاربران فراهم کرده و خرید را آسان&zwnj;تر می&zwnj;کند.</span></p>
<p><strong>درگاه&zwnj;های پرداخت؛ پذیرش امن و سریع تراکنش&zwnj;ها</strong></p>
<p><span style="font-weight: 400;">دیجی&zwnj;پی با ارائه درگاه&zwnj;های پرداخت آنلاین، تسویه سریع و امنیت بالا را برای کسب&zwnj;وکارها و مشتریان فراهم می&zwnj;کند. با درگاه پرداخت دیجی&zwnj;پی، می&zwnj;توانید پرداخت&zwnj;های اینترنتی را با سرعت و اطمینان انجام دهید و تجربه&zwnj;ای مطمئن از خرید آنلاین داشته باشید.</span></p>
<p><strong>خرید حضوری با اعتبار دیجی پی</strong></p>
<p><span style="font-weight: 400;">شما میتوانید با اعتبار دیجی پی، از فروشگاه های حضوری در مراکز خریدی مانند <a href="https://www.mydigipay.com/stores/malls/opal/">اپال سعادت  آباد</a>، <a href="https://www.mydigipay.com/stores/malls/niyayesh/" >نیایش مال</a> و <a href="https://www.mydigipay.com/stores/malls/hadish/">هدیش مال</a> خرید کنید.</span></p>
<p><strong>پرداخت قبوض، خرید شارژ و بسته اینترنتی</strong></p>
<p><span style="font-weight: 400;">با دیجی&zwnj;پی دیگر نیازی به مراجعه به چندین پلتفرم برای پرداخت قبوض و </span><a href="https://www.mydigipay.com/top-up/"><span style="font-weight: 400;">خرید شارژ</span></a><span style="font-weight: 400;"> ندارید. تنها با چند کلیک می&zwnj;توانید قبض&zwnj;های خود را پرداخت کنید، سیم&zwnj;کارت خود را شارژ کنید یا بسته اینترنتی بخرید. این سرویس به شما کمک می&zwnj;کند تا همیشه به&zwnj;صورت آنلاین و بدون وقفه در ارتباط باشید.</span></p>
<p><strong>بیمه تجهیزات الکترونیک و بیمه شخص ثالث</strong></p>
<p><span style="font-weight: 400;">حفاظت از دارایی&zwnj;های دیجیتال و وسایل نقلیه یکی از دغدغه&zwnj;های مهم کاربران است. دیجی&zwnj;پی با ارائه بیمه تجهیزات الکترونیک مانند: </span><a href="https://www.mydigipay.com/insurtech/equipment/"><span style="font-weight: 400;">بیمه موبایل</span></a><span style="font-weight: 400;"> و سایر وسایل دیجیتال شما را در برابر آسیب&zwnj;ها و حوادث تحت پوشش قرار می&zwnj;دهد. همچنین، با </span><a href="https://www.mydigipay.com/mag/thirdparty-insurance/"><span style="font-weight: 400;">بیمه شخص ثالث</span></a><span style="font-weight: 400;">، می&zwnj;توانید خودرو خود را به&zwnj;راحتی و با بهترین قیمت بیمه کنید.</span></p>
<p><strong>مدیریت ثروت؛ سرمایه&zwnj;گذاری هوشمند برای آینده&zwnj;ای مطمئن</strong></p>
<p><span style="font-weight: 400;">دیجی&zwnj;پی تنها یک ابزار پرداخت نیست، بلکه یک همراه مالی برای رشد سرمایه شماست. با سرویس مدیریت ثروت، می&zwnj;توانید به روش&zwnj;های نوین سرمایه&zwnj;گذاری دسترسی داشته باشید و با تصمیم&zwnj;های هوشمندانه، ارزش دارایی&zwnj;های خود را افزایش دهید.</span></p>
<p><strong>استعلام و پرداخت جریمه و عوارض جاده&zwnj;ای</strong></p>
<p><span style="font-weight: 400;">با دیجی&zwnj;پی، دیگر نیازی به مراجعه به سامانه&zwnj;های مختلف برای استعلام و پرداخت جریمه&zwnj;های رانندگی یا عوارض جاده&zwnj;ای ندارید. این سرویس به شما امکان می&zwnj;دهد که تنها با چند کلیک، جریمه&zwnj;ها و عوارض خود را بررسی و پرداخت کنید.</span></p>
<p><strong>دیجی&zwnj;پی، راهکاری هوشمند برای مدیریت مالی</strong></p>
<p><span style="font-weight: 400;">ما در دیجی&zwnj;پی تلاش می&zwnj;کنیم تا تمامی نیازهای مالی شما را در یک بستر یکپارچه برطرف کنیم. از خرید روزمره گرفته تا سرمایه&zwnj;گذاری و بیمه، همه چیز در اپلیکیشن دیجی&zwnj;پی در دسترس شماست.</span></p>`;

  isExpanded = false;
  private isBrowser: boolean;
  currentDomain = '';

  samandehiData = signal<{
    hypertextReference: string;
    id: string;
    logoPath: string;
  } | null>(null);

  virtualBuisinesData = signal<{
    hypertextReference: string;
    id: string;
    logoPath: string;
  } | null>(null);

  showVirtualBuisinesLogo = signal<boolean>(false);

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentDomain = document.location.hostname;
      this.enamadHrefHandler();

      switch (this.currentDomain) {
        case 'www.mydigipay.com':
        case 'mydigipay.com':
          this.showVirtualBuisinesLogo.set(true);
          this.samandehiData.set({
            hypertextReference: 'https://logo.samandehi.ir/Verify.aspx?id=163588&p=rfthgvkaxlaodshwmcsimcsi',
            id: 'jxlzfukzrgvjapfuoeukoeuk',
            logoPath: 'https://logo.samandehi.ir/logo.aspx?id=163588&p=nbpdwlbqqftiujynaqgwaqgw'
          });
          this.virtualBuisinesData.set({
            hypertextReference: 'https://ecunion.ir/verify/mydigipay.com?token=411406268a947db16679',
            id: '411406268a947db16679',
            logoPath: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Im0xMjAgMjQzbDk0LTU0IDAtMTA5IC05NCA1NCAwIDEwOSAwIDB6IiBmaWxsPSIjODA4Mjg1Ii8+Cgk8cGF0aCBkPSJtMTIwIDI1NGwtMTAzLTYwIDAtMTE5IDEwMy02MCAxMDMgNjAgMCAxMTkgLTEwMyA2MHoiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDo1O3N0cm9rZTojMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjE0IDgwbC05NC01NCAtOTQgNTQgOTQgNTQgOTQtNTR6IiBmaWxsPSIjMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjYgODBsMCAxMDkgOTQgNTQgMC0xMDkgLTk0LTU0IDAgMHoiIGZpbGw9IiM1ODU5NWIiLz4KCTxwYXRoIGQ9Im0xMjAgMTU3bDQ3LTI3IDAtMjMgLTQ3LTI3IC00NyAyNyAwIDU0IDQ3IDI3IDQ3LTI3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlOiNmZmYiLz4KCTx0ZXh0IHg9IjE1IiB5PSIzMDAiIGZvbnQtc2l6ZT0iMjVweCIgZm9udC1mYW1pbHk9IidCIFlla2FuJyIgc3R5bGU9ImZpbGw6IzI5Mjk1Mjtmb250LXdlaWdodDpib2xkIj7Yudi22Ygg2KfYqtit2KfYr9uM2Ycg2qnYtNmI2LHbjDwvdGV4dD4KCTx0ZXh0IHg9IjgiIHk9IjM0MyIgZm9udC1zaXplPSIyNXB4IiBmb250LWZhbWlseT0iJ0IgWWVrYW4nIiBzdHlsZT0iZmlsbDojMjkyOTUyO2ZvbnQtd2VpZ2h0OmJvbGQiPtqp2LPYqCDZiCDaqdin2LHZh9in24wg2YXYrNin2LLbjDwvdGV4dD4KPC9zdmc+ '
          });
          break;

        case 'www.digipay.ir':
        case 'digipay.ir':
          this.samandehiData.set({
            hypertextReference: 'https://logo.samandehi.ir/Verify.aspx?id=301576&p=xlaoobpdrfthdshwjyoegvka',
            id: 'rgvjesgtjxlzapfujzpefukz',
            logoPath: 'https://logo.samandehi.ir/logo.aspx?id=301576&p=qftilymanbpdujynyndtwlbq'
          });
          break;

        case 'www.mydigipay.ir':
        case 'mydigipay.ir':
          this.samandehiData.set({
            hypertextReference: 'https://logo.samandehi.ir/Verify.aspx?id=163588&p=rfthgvkaxlaodshwmcsimcsi',
            id: 'jxlzfukzrgvjapfuoeukoeuk',
            logoPath: 'https://logo.samandehi.ir/logo.aspx?id=163588&p=nbpdwlbqqftiujynaqgwaqgw'
          });
          break;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // this.checkScreenSize();
      // window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  get toggleText(): string {
    return this.isExpanded ? 'کمتر...' : 'بیشتر...';
  }

  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }

  toggleCollapsible(section: string) {
    this.collapsibleState[section] = !this.collapsibleState[section];
  }

  private checkScreenSize() {
    const topFooter = this.el.nativeElement.querySelector('.top-footer-section');
    if (window.innerWidth >= 1280) {
      this.renderer.addClass(topFooter, 'container');
      this.renderer.removeClass(topFooter, 'pr-small');
    } else {
      this.renderer.removeClass(topFooter, 'container');
      this.renderer.addClass(topFooter, 'pr-small');
    }
  }

  enamadHypertextReference = '';
  enamndId = '';
  enamadLogoPath = '';

  enamadHrefHandler() {
    switch (this.currentDomain) {
      case 'www.mydigipay.com':
      case 'mydigipay.com': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=140000&Code=uRw7AnjLqvHolCe6MOxF';
        this.enamndId = 'uRw7AnjLqvHolCe6MOxF';
        this.enamadLogoPath = 'https://Trustseal.eNamad.ir/logo.aspx?id=140000&Code=uRw7AnjLqvHolCe6MOxF';
        break;
      }
      case 'www.digipay.ir':
      case 'digipay.ir': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=316449&Code=c5oFAjqjBLdDLgfQiMPW';
        this.enamndId = 'c5oFAjqjBLdDLgfQiMPW';
        this.enamadLogoPath = 'https://trustseal.enamad.ir/logo.aspx?id=316449&Code=c5oFAjqjBLdDLgfQiMPW';
        break;
      }
      case 'www.mydigipay.ir':
      case 'mydigipay.ir': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=494963&Code=iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        this.enamndId = 'iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        this.enamadLogoPath = 'https://Trustseal.eNamad.ir/logo.aspx?id=494963&Code=iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        break;
      }
    }
  }

  openPopup(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(
        url,
        'Popup',
        'toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=450,height=630,top=30'
      );
    }
  }
}
