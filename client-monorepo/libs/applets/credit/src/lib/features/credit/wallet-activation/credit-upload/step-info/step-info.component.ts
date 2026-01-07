import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StepInfoRouteData } from './step-info-route-data.model';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditRouteStateInterface } from '../../../data-access/services/route-state/credit-route-state.interface';
import { BaseApiService } from '../../../data-access/services/base-api.service';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-step-info',
  templateUrl: './step-info.component.html',
  styleUrls: ['./step-info.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepInfoComponent implements OnInit {
  title = signal<string | null>(null);

  buttonText = signal<string | null>(null);

  url!: string;

  _html = signal<SafeHtml | null>(null);

  gettingContent = signal<boolean | null>(null);

  routeState: StepInfoRouteData;

  private apiService = inject(BaseApiService);
  private sanitizer = inject(DomSanitizer);
  private cache = inject(CreditCacheService);
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    this.routeState = this.routeStateService.getAll() as StepInfoRouteData;
    if (!this.routeState.relativeFileUrl) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }
    this.title.set(this.routeState.title);
    this.buttonText.set(this.routeState.buttonText);
    this.url = this.routeState.relativeFileUrl;
  }

  ngOnInit() {
    this.getPageContent();
  }

  /**
   * since API doest not allow viewing the pages using iFrame,
   * we should take pages content (HTML) and pass it into
   * `srcdoc` attribute of the iframe
   */
  getPageContent() {
    const CACHE_KEY = '_page_cache_' + this.url;

    if (!this.cache.has(CACHE_KEY)) {
      this.gettingContent.set(true);

      this.apiService.getHtml(this.url).subscribe({
        next: (html) => {
          this.gettingContent.set(false);
          this._html.set(this.sanitizer.bypassSecurityTrustHtml(html));

          this.cache.put(CACHE_KEY, this._html());
        },
        error: () => {
          this.gettingContent.set(false);
        },
      });
    } else {
      this._html.set(this.cache.get(CACHE_KEY));
    }
  }

  buttonClick() {
    // get back to the origin
    this.router.navigateByUrl(this.routeState.backUrl, {
      state: this.routeState.prevState,
    });
  }
}
