import {ChangeDetectionStrategy, Component, Inject, inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {DomSanitizer} from "@angular/platform-browser";
import {delay, of} from "rxjs";
import {UrlService} from "../../../../services/url.service";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {ScrollToAnchorDirective} from "../../../../../ui/ui-directive/scroll-to-anchor.directive";

@Component({
  selector: 'app-black-friday-hot-deals',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, ScrollToAnchorDirective,],
  templateUrl: './blackFridayHotDeals.component.html',
  styleUrl: './blackFridayHotDeals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayHotDealsComponent implements OnInit {
  hotDeals = input<{
    title: string,
    subtitle: string,
    narrowTitle: string,
    products: Array<{
      image: ApiFile,
      link: string | null
    }>
  }>();
  link = input<string>('');

  activeOverlay = signal<any | null>(null);

  private urlService = inject(UrlService);

  constructor(private sanitizer: DomSanitizer,
              @Inject(PLATFORM_ID) public platformID: string) {
  }

  mobileMode = signal<boolean>(false);

  handleProductHover(product: { image: ApiFile, link: string | null }) {
    if (!product.link) {
      this.activeOverlay.set(product);
    } else {
      this.activeOverlay.set(null);
    }
  }

  handleProductClick(product: any) {
    if (!product.link) {
      this.activeOverlay.set(product );
    } else {
      this.urlService.handleLink(product.link);
      this.activeOverlay.set(null);
    }
  }

  handleProductLeave(product: any) {
    if (this.activeOverlay() === product) {
      this.activeOverlay.set(null);
    }
  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }

  openLink() {
    this.urlService.handleLink(this.link());
  }
}
