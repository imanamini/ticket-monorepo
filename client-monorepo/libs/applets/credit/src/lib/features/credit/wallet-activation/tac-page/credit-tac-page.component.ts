import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CreditCacheService } from '../../data-access/services/credit-cache.service';
import { fixWebViewHtml } from '../../data-access/utils/strings';
import { Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditTacResponse } from '../../data-access/models/credit/credit-tac-response.model';
import { CreditRouteStateInterface } from '../../data-access/services/route-state/credit-route-state.interface';
import { Subscription } from 'rxjs';
import { CreditTacService } from '../credit-tac.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-tac-page',
  templateUrl: './credit-tac-page.component.html',
  styleUrls: ['./credit-tac-page.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxButtonComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditTacPageComponent implements OnInit, OnDestroy {
  pageId = 'tac';

  gettingContent = signal(false);

  _html = signal<SafeHtml | null>(null);

  destinationRoute!: string;

  destinationState = {};

  tacResponse = signal<CreditTacResponse | null>(null);

  shouldAcceptTac = signal<boolean | null>(null);

  shouldAcceptTacSubscription!: Subscription;

  showLoading = signal<boolean | null>(null);

  creditHomeUrl = signal<string | null>(null);

  private sanitizer = inject(DomSanitizer);
  private cache = inject(CreditCacheService);
  private router = inject(Router);
  private creditService = inject(CreditApiService);
  private creditTacService = inject(CreditTacService);
  private creditUrlService = inject(CreditUrlService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    this.creditHomeUrl.set(this.creditUrlService.getInnerServicePath('/overview'));
  }

  ngOnInit() {
    this.shouldAcceptTacSubscription = this.creditTacService.shouldAccept.subscribe((shouldAccept) => {
      this.shouldAcceptTac.set(shouldAccept);
    });
    this.getPageContent();

    const state = this.routeStateService.getAll();
    if (state.destination) {
      this.destinationRoute = state.destination;
    }
    if (state.destinationState) {
      this.destinationState = state.destinationState;
    }
  }

  /**
   * Get page content and render directly without iframe for iOS compatibility
   */
  getPageContent() {
    this.gettingContent.set(true);

    const TAC_HTML_CACHE = 'CREDIT_TAC_HTML_CACHE_V4';

    this.getTacData().then((response) => {
      this.tacResponse.set(response);

      if (this.cache.has(TAC_HTML_CACHE)) {
        const html = this.cache.get(TAC_HTML_CACHE);
        this._html.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.gettingContent.set(false);
        return;
      }

      this.creditService.getTacPage(response).subscribe({
        next: (html) => {
          this.gettingContent.set(false);
          html = this.processHtml(html);
          this.cache.put(TAC_HTML_CACHE, html);
          this._html.set(this.sanitizer.bypassSecurityTrustHtml(html));
        },
        error: () => {
          this.gettingContent.set(false);
        },
      });
    });
  }

  private processHtml(html: string): string {
    // Remove html, head, body tags to render content directly
    html = html.replace(/<\/?html[^>]*>/gi, '');
    html = html.replace(/<\/?head[^>]*>/gi, '');
    html = html.replace(/<\/?body[^>]*>/gi, '');

    // Extract and process style tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styles = '';
    html = html.replace(styleRegex, (match, content) => {
      styles += content;
      return '';
    });

    // Add styles back at the beginning
    if (styles) {
      html = `<style>${styles}</style>` + html;
    }

    // Apply fixWebViewHtml
    html = fixWebViewHtml(html);

    return html;
  }

  onConfirm() {
    this.showLoading.set(true);
    this.creditTacService.confirm().subscribe(() => {
      this.showLoading.set(false);
      if (this.destinationRoute) {
        this.router
          .navigateByUrl(this.destinationRoute, {
            state: this.destinationState,
          })
          .then();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.shouldAcceptTacSubscription) {
      this.shouldAcceptTacSubscription.unsubscribe();
    }
  }

  private getTacData(): Promise<CreditTacResponse> {
    return new Promise((resolve) => {
      const CACHE_KEY = 'CREDIT_TAC_CACHE';
      if (!this.cache.has(CACHE_KEY)) {
        this.creditTacService.getData().subscribe((response) => {
          this.cache.put(CACHE_KEY, response);
          resolve(response);
        });
      } else {
        resolve(this.cache.get(CACHE_KEY));
      }
    });
  }
}
