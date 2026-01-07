import { AfterViewInit, Component, inject, OnInit, Renderer2, signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ReferrerService } from './data-access/services/referrer.service';
import { UserAuthService } from './data-access/services/user-services/user-auth.service';
import { MetricService } from './data-access/services/metric.service';
import { FeatureToggleService } from './data-access/services/feature-toggle.service';
import { ErrorStateDigikalaPinCodeComponent } from './features/home/error-state-digikala-pin-code/error-state-digikala-pin-code.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ReferrerEnum } from './data-access/enums/referrer.enum';
import { EnvironmentService } from '@client-monorepo/app-core';
import { AppNameService, isIPhone } from '@client-monorepo/common/utilities';
import { InsDigikalaService } from './data-access/services/ins-digikala.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, ErrorStateDigikalaPinCodeComponent, NgxSpinnerModule],
  providers: [],
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // Required for global styles to apply across the entire insurance applet
})
export class AppComponent implements OnInit, AfterViewInit {
  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  private document = inject(DOCUMENT);
  private userAuthService = inject(UserAuthService);
  private renderer = inject(Renderer2);
  private referrerService = inject(ReferrerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private metricService = inject(MetricService);
  private digikalaService = inject(InsDigikalaService);
  private featureToggleService = inject(FeatureToggleService);
  private appNameService = inject(AppNameService);
  protected hasPinCodeError = toSignal<boolean>(this.digikalaService.showErrorStateDgkPinCode$);
  protected isLoading = signal<boolean>(this.digikalaService.isDigikala);

  ngOnInit(): void {
    this.handleFeatureToggle();
    this.handleCustomQueryParams();
    this.checkIosDevice();
    this.checkIsDigikala();
    this.referrerService.setReferrerSourceFromUrl();
    this.initAuth();
  }

  private handleFeatureToggle(): void {
    this.featureToggleService.featureToggle$.subscribe((feature) => {
      if (feature && this.environment.name === 'production') {
        this.router.navigate(['/']).then();
      }
    });
    if (this.environment.name !== 'production') {
      this.featureToggleService.featureToggle(true);
    }
  }

  private initAuth(): void {
    if (this.appNameService.isPillar()) {
      //  this.digikalaService.isDigikalaSuperApp ||
      //       (this.digikalaSuperWebService.isDigikalaSuperWeb && this.digikalaSuperWebService.saTokenDGK)
      this.digikalaService.authDigikalaService.initialLoginDigiPayToDigikala().finally(() => {
        this.isLoading.set(false);
      });
    } else {
      this.userAuthService.initAuth();
      this.isLoading.set(false);
    }
  }

  private checkIosDevice(): void {
    if (isIPhone()) {
      this.renderer.addClass(this.document.body, 'iphone-style');
    }
  }

  private checkIsDigikala(): void {
    if (this.digikalaService.isDigikala) {
      this.renderer.addClass(this.document.body, 'custom-digikala-style');
    }
  }

  private handleCustomQueryParams(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      // Don't process query params if we've navigated outside the insurance applet
      if (!this.router.url.includes('/mini-app/insurance/')) {
        return;
      }

      if (!this.router.routerState.snapshot.root.queryParams) {
        return;
      }
      if (event instanceof NavigationEnd) {
        this.saveCustomQueryParam();
      }
    });
  }

  private saveCustomQueryParam(): void {
    const params: Record<string, string> = {};
    Object.keys(this.referrerService.utmSource).forEach((key) => {
      if (!this.activatedRoute.snapshot.queryParams[key]) {
        params[key] = this.referrerService.utmSource[key];
      }
    });
    if (this.referrerService.referrer) {
      params.referrer = this.referrerService.referrer;
    }
    this.router.navigate([], {
      queryParams: { ...this.activatedRoute.snapshot.queryParams, ...params },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      fragment: this.activatedRoute.snapshot.fragment,
    });
  }

  ngAfterViewInit(): void {
    if (ReferrerService.referrerSourceDpxItems.includes(this.referrerService.referrer as ReferrerEnum)) {
      this.metricService.sendMetric('comeFromDpx', null, null);
    }
  }
}
